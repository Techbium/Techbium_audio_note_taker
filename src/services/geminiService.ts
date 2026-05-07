import { GoogleGenAI } from "@google/genai";

const getGeminiApiKey = () =>
  import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";

const getAiClient = () => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Add VITE_GEMINI_API_KEY to your .env file and restart the app.",
    );
  }

  return new GoogleGenAI({ apiKey });
};

export async function generateStudentNotes(audioBase64: string, mimeType: string) {
  const model = "gemini-2.5-flash";
  
  const systemInstruction = `You are an elite academic scribe specializing in creating exhaustive, high-fidelity student notes. 
The user is using these notes to catch up on lectures they MISSSED, so you must be extremely thorough, explaining concepts from the ground up.

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
              text: "Please take detailed student notes based on this audio.",
            },
          ],
        },
      ],
      config: {
        systemInstruction,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unexpected error while processing audio.");
  }
}
