import { GoogleGenAI } from '@google/genai';
import type { NoteGenerationMode } from '../types/audioNotes';
import { NOTE_MODE_OPTIONS } from '../types/audioNotes';

const getGeminiApiKey = () =>
  import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

const getAiClient = () => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      'Missing Gemini API key. Add VITE_GEMINI_API_KEY to your .env file and restart the app.',
    );
  }

  return new GoogleGenAI({ apiKey });
};

const DEFAULT_MASTER_NOTE_INSTRUCTION = `You are an elite academic scribe specializing in creating exhaustive, high-fidelity student notes.
The user is using these notes to catch up on lectures they missed, so you must be extremely thorough, explaining concepts from the ground up.

Your goal is to transcribe and then transform the provided audio into a comprehensive "Master Note" set.
Do not summarize; instead, ELABORATE. Treat this as a complete substitute for attending the class.

Include these sections in this EXACT order:
1. **Title & Session Overview**: A descriptive title and a 200-300 word contextual summary of the lecture's scope.
2. **Detailed Narrative**: A chronological, multi-paragraph walkthrough of the lecture flow, capturing the teacher's examples and side-notes.
3. **Deep-Dive Concepts**: For EVERY major topic discussed:
   - Provide a bolded Heading.
   - Give a thorough explanation (as if teaching a beginner).
   - List specific examples or analogies used in the audio.
4. **Information Synthesis**: Connect this lecture to broader academic themes or previous foundational knowledge.
5. **Technical Glossary**: Exhaustive list of every technical term, acronym, or jargon used, with 2-sentence definitions.
6. **Action Items & References**: Homework, reading assignments, or further study materials mentioned.
7. **Comprehensive Study Guide**: 5-8 challenging questions with suggested answer outlines to test mastery.

Formatting: Use clean Markdown with clear hierarchies (H1, H2, H3). Use bolding and bullet points for readability but preserve the length and depth of explanations.`;

function systemInstructionForMode(mode: NoteGenerationMode): string {
  const always = `You receive lecture or meeting audio. Reply in Markdown only (no preamble like "Here are your notes"). Stay faithful to what was actually said; do not invent facts.`;

  switch (mode) {
    case 'verbatim':
      return `${always}

You are a professional transcriber. Produce a faithful word-for-word (or as close as the audio allows) account of what was said.
Preserve speaking order and natural phrasing, including light disfluencies when they matter.
Use paragraph breaks where the speaker pauses or changes topic.
Do not summarize, explain, or add study aids unless the user's extra instructions explicitly ask for that.
Optional: one H1 at the top only if a clear session title is stated in the audio; otherwise begin with the transcript.`;

    case 'studentNote':
      return `${always}

Create structured study notes for someone who missed the session.
Use Markdown with: an H1 title, 2-4 sentences of context, bullet **Key takeaways**, topic sections with concise explanations, **bold** important terms, and 3-5 short review questions at the end.
Aim for moderate depth—readable and scannable, not a textbook-length write-up.`;

    case 'summary':
      return `${always}

Provide a concise summary: H1 title, two short overview paragraphs, then 5-10 tight bullet key points.
Keep total length modest (roughly under 600 words) unless the source clearly needs more.
Skip long narrative, glossary, and exhaustive study sections unless the user's extra instructions request them.`;

    case 'detailedNote':
      return `${always}

Produce thorough course-style notes in Markdown with nested headings (H1/H2/H3), detailed explanations, concrete examples taken from the audio, a **Technical glossary** for important terms, and a **Study guide** (questions with brief answer cues).
Organize sections flexibly, but remain comprehensive and precise—without following the rigid 7-part default template.`;

    case 'default':
    default:
      return `${always}

${DEFAULT_MASTER_NOTE_INSTRUCTION}`;
  }
}

export type GenerateAudioNotesOptions = {
  mode?: NoteGenerationMode;
  /** Optional user preferences (tone, section names, language, etc.). */
  stylePrompt?: string;
};

function modeLabel(mode: NoteGenerationMode): string {
  return NOTE_MODE_OPTIONS.find((o) => o.value === mode)?.label ?? mode;
}

export async function generateAudioNotes(
  audioBase64: string,
  mimeType: string,
  options: GenerateAudioNotesOptions = {},
) {
  const model = 'gemini-2.5-flash';
  const mode = options.mode ?? 'default';

  let systemInstruction = systemInstructionForMode(mode);
  const extra = options.stylePrompt?.trim();
  if (extra) {
    systemInstruction += `

Additional formatting or style preferences from the user—apply them on top of the selected mode. If anything conflicts, prioritize factual fidelity to the audio, then these preferences:
${extra}`;
  }

  const label = modeLabel(mode);
  const userText = `Produce the requested output from this audio using mode "${label}".`;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: audioBase64,
              },
            },
            {
              text: userText,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response.');
    }

    return response.text;
  } catch (error) {
    console.error('Gemini Error:', error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Unexpected error while processing audio.');
  }
}
