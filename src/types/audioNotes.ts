export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

/** How the model should shape output from the audio. */
export type NoteGenerationMode =
  | 'default'
  | 'verbatim'
  | 'studentNote'
  | 'summary'
  | 'detailedNote';

export const NOTE_MODE_OPTIONS: {
  value: NoteGenerationMode;
  label: string;
  description: string;
}[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'Full master-note template (overview, narrative, concepts, glossary, study guide).',
  },
  {
    value: 'verbatim',
    label: 'Word for word',
    description: 'Faithful transcript-style output; minimal rewriting.',
  },
  {
    value: 'studentNote',
    label: 'Student note',
    description: 'Structured study notes—clear and scannable, moderate depth.',
  },
  {
    value: 'summary',
    label: 'Summary',
    description: 'Shorter condensed overview and key takeaways.',
  },
  {
    value: 'detailedNote',
    label: 'Detailed note',
    description: 'Thorough explanations and glossary without the fixed default sections.',
  },
];
