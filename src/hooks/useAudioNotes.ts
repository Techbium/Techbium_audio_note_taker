import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { generateAudioNotes } from '../services/geminiService';
import { generateDocx } from '../lib/documentGenerator';
import {
  generatePdfFromElement,
  generatePdfFromMarkdownOnly,
} from '../lib/pdfGenerator';
import { readFileAsBase64 } from '../lib/readFileAsBase64';
import { getQuotaStatus, tryConsumeQuota } from '../lib/requestQuota';
import type { NoteGenerationMode, ProcessingStatus } from '../types/audioNotes';

export function useAudioNotes() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [noteMode, setNoteMode] = useState<NoteGenerationMode>('default');
  const [stylePrompt, setStylePrompt] = useState('');
  const [quota, setQuota] = useState(getQuotaStatus);
  const [pdfBusy, setPdfBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type.startsWith('audio/')) {
      setFile(selected);
      setError(null);
    } else {
      setError('Please select a valid audio file.');
    }
  }, []);

  const processAudio = useCallback(async () => {
    if (!file) return;

    setStatus('processing');
    setError(null);

    try {
      const gate = tryConsumeQuota();
      if (gate.ok === false) {
        setError(
          `Daily generation limit reached (${gate.limit} per day for this browser). Try again tomorrow, or ask the app owner to raise VITE_DAILY_AI_REQUEST_LIMIT.`,
        );
        setStatus('error');
        setQuota(getQuotaStatus());
        return;
      }
      setQuota(getQuotaStatus());

      const base64 = await readFileAsBase64(file);
      const result = await generateAudioNotes(base64, file.type, {
        mode: noteMode,
        stylePrompt: stylePrompt.trim() || undefined,
      });

      if (result) {
        setNotes(result);
        setStatus('success');
      } else {
        throw new Error('No response from AI');
      }
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to process audio. Please try again.';
      setError(message);
      setStatus('error');
    }
  }, [file, noteMode, stylePrompt]);

  const downloadDoc = useCallback(async () => {
    if (!notes) return;
    const baseName = file?.name.replace(/\.[^/.]+$/, '') ?? 'notes';
    await generateDocx(notes, `${baseName}_Notes.docx`);
  }, [file?.name, notes]);

  const downloadPdf = useCallback(
    async (contentElement: HTMLElement | null) => {
      if (!notes) return;
      const baseName = file?.name.replace(/\.[^/.]+$/, '') ?? 'notes';
      const filename = `${baseName}_Notes.pdf`;
      setPdfBusy(true);
      try {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
        if (contentElement) {
          await generatePdfFromElement(contentElement, filename, notes);
        } else {
          generatePdfFromMarkdownOnly(notes, filename);
        }
      } catch (err) {
        console.error('PDF export error', err);
        generatePdfFromMarkdownOnly(notes, filename);
      } finally {
        setPdfBusy(false);
      }
    },
    [file?.name, notes],
  );

  const reset = useCallback(() => {
    setFile(null);
    setNotes(null);
    setStatus('idle');
    setError(null);
    setQuota(getQuotaStatus());
  }, []);

  return {
    file,
    status,
    error,
    notes,
    noteMode,
    setNoteMode,
    stylePrompt,
    setStylePrompt,
    quota,
    pdfBusy,
    fileInputRef,
    handleFileChange,
    processAudio,
    downloadDoc,
    downloadPdf,
    reset,
  };
}
