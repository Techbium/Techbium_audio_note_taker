import { motion } from 'motion/react';
import { Upload, AlertCircle } from 'lucide-react';
import type { RefObject } from 'react';
import type { ChangeEvent } from 'react';
import type { NoteGenerationMode } from '../../types/audioNotes';
import { NOTE_MODE_OPTIONS } from '../../types/audioNotes';
import type { QuotaStatus } from '../../lib/requestQuota';

type UploadPanelProps = {
  file: File | null;
  error: string | null;
  quota: QuotaStatus;
  noteMode: NoteGenerationMode;
  stylePrompt: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPickFile: () => void;
  onProcess: () => void;
  onNoteModeChange: (mode: NoteGenerationMode) => void;
  onStylePromptChange: (value: string) => void;
};

export function UploadPanel({
  file,
  error,
  quota,
  noteMode,
  stylePrompt,
  fileInputRef,
  onFileChange,
  onPickFile,
  onProcess,
  onNoteModeChange,
  onStylePromptChange,
}: UploadPanelProps) {
  return (
    <motion.div
      key="upload"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
    >
      <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <span className="font-medium text-gray-800">Daily generations (this browser): </span>
        {quota.remaining} left of {quota.limit}
        {quota.remaining === 0 ? (
          <span className="block mt-1 text-amber-700 font-medium">
            Limit reached—try again tomorrow or contact the app owner about raising the cap.
          </span>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onPickFile}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPickFile();
          }
        }}
        className="border-2 border-dashed border-gray-200 rounded-[1.5rem] p-12 text-center hover:border-gray-400 transition-colors cursor-pointer group"
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="audio/*"
          onChange={onFileChange}
        />
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 transition-colors">
          <Upload className="text-gray-400 group-hover:text-black transition-colors" />
        </div>
        <h2 className="text-xl font-medium mb-1">
          {file ? file.name : 'Choose an audio file'}
        </h2>
        <p className="text-gray-400 text-sm">
          Drag and drop your lecture recording (MP3, WAV, etc.)
        </p>
      </div>

      <div className="mt-6 space-y-2">
        <label
          htmlFor="note-mode"
          className="block text-sm font-medium text-gray-700"
        >
          Output style
        </label>
        <select
          id="note-mode"
          value={noteMode}
          onChange={(e) =>
            onNoteModeChange(e.target.value as NoteGenerationMode)
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        >
          {NOTE_MODE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 leading-relaxed">
          {NOTE_MODE_OPTIONS.find((o) => o.value === noteMode)?.description}
        </p>
      </div>

      <div className="mt-5 space-y-2">
        <label
          htmlFor="style-prompt"
          className="block text-sm font-medium text-gray-700"
        >
          How should the notes look?{' '}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="style-prompt"
          value={stylePrompt}
          onChange={(e) => onStylePromptChange(e.target.value)}
          rows={3}
          placeholder="e.g. Use UK spelling, add a timeline section, keep bullets short, output in French…"
          className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black min-h-[88px]"
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 animate-shake">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <button
        type="button"
        disabled={!file || quota.remaining === 0}
        onClick={onProcess}
        className="w-full mt-6 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        Generate Notes
      </button>
      <p className="text-gray-400 text-sm text-center mt-4">Made by @techbium</p>
    </motion.div>
  );
}
