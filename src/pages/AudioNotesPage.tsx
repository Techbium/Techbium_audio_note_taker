import { useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAudioNotes } from '../hooks/useAudioNotes';
import { PageShell } from '../components/layout/PageShell';
import { AppHeader } from '../components/audio-notes/AppHeader';
import { AppFooter } from '../components/audio-notes/AppFooter';
import { UploadPanel } from '../components/audio-notes/UploadPanel';
import { ProcessingPanel } from '../components/audio-notes/ProcessingPanel';
import { NotesResultPanel } from '../components/audio-notes/NotesResultPanel';

export function AudioNotesPage() {
  const notesExportRef = useRef<HTMLDivElement>(null);
  const {
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
  } = useAudioNotes();

  return (
    <PageShell>
      <AppHeader />
      <p className="text-center -mt-6 mb-8">
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          ← Back to welcome
        </Link>
      </p>
      <main>
        <AnimatePresence mode="wait">
          {status === 'idle' || status === 'error' ? (
            <UploadPanel
              file={file}
              error={error}
              quota={quota}
              noteMode={noteMode}
              stylePrompt={stylePrompt}
              fileInputRef={fileInputRef}
              onFileChange={handleFileChange}
              onPickFile={() => fileInputRef.current?.click()}
              onProcess={processAudio}
              onNoteModeChange={setNoteMode}
              onStylePromptChange={setStylePrompt}
            />
          ) : status === 'processing' ? (
            <ProcessingPanel />
          ) : status === 'success' && notes ? (
            <NotesResultPanel
              ref={notesExportRef}
              fileName={file?.name}
              notes={notes}
              onReset={reset}
              onDownloadDocx={downloadDoc}
              pdfBusy={pdfBusy}
              onDownloadPdf={() => downloadPdf(notesExportRef.current)}
            />
          ) : null}
        </AnimatePresence>
      </main>
      <AppFooter />
    </PageShell>
  );
}
