import { forwardRef } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { CheckCircle2, Download, FileDown } from 'lucide-react';

type NotesResultPanelProps = {
  fileName: string | undefined;
  notes: string;
  onReset: () => void;
  onDownloadDocx: () => void;
  onDownloadPdf: () => void;
  pdfBusy: boolean;
};

export const NotesResultPanel = forwardRef<HTMLDivElement, NotesResultPanelProps>(
  function NotesResultPanel(
    { fileName, notes, onReset, onDownloadDocx, onDownloadPdf, pdfBusy },
    ref,
  ) {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3 p-2 pl-4 pr-6 bg-white rounded-full shadow-sm border border-gray-100">
            <CheckCircle2 className="text-green-500" size={20} />
            <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">
              {fileName}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              onClick={onReset}
              className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              New Note
            </button>
            <button
              type="button"
              disabled={pdfBusy}
              onClick={onDownloadPdf}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <FileDown size={16} />
              {pdfBusy ? 'PDF…' : 'PDF'}
            </button>
            <button
              type="button"
              onClick={onDownloadDocx}
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-all active:scale-95"
            >
              <Download size={16} />
              Word
            </button>
          </div>
        </div>

        <div
          ref={ref}
          className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 min-h-[400px]"
        >
          <div className="prose prose-slate max-w-none prose-headings:font-light prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-2xl prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
            <Markdown>{notes}</Markdown>
          </div>
        </div>
      </motion.div>
    );
  },
);
