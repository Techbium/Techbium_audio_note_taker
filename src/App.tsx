import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileAudio, 
  Upload, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Volume2
} from 'lucide-react';
import Markdown from 'react-markdown';
import { generateStudentNotes } from './services/geminiService';
import { generateDocx } from './lib/documentGenerator';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please select a valid audio file.");
      }
    }
  };

  const processAudio = async () => {
    if (!file) return;

    setStatus('processing');
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const result = await generateStudentNotes(base64, file.type);
      
      if (result) {
        setNotes(result);
        setStatus('success');
      } else {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to process audio. Please try again.";
      setError(message);
      setStatus('error');
    }
  };

  const downloadDoc = async () => {
    if (!notes) return;
    await generateDocx(notes, `${file?.name.split('.')[0]}_Notes.docx`);
  };

  const reset = () => {
    setFile(null);
    setNotes(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-gray-900 py-12 px-4 selection:bg-black selection:text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-black text-white rounded-2xl mb-4"
          >
            <Volume2 size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-light tracking-tight mb-2"
          >
            AudioNotes <span className="font-semibold text-black">AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-medium"
          >
            Transform lectures into structured knowledge
          </motion.p>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'error' ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-[1.5rem] p-12 text-center hover:border-gray-400 transition-colors cursor-pointer group"
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    accept="audio/*"
                    onChange={handleFileChange}
                  />
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 transition-colors">
                    <Upload className="text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <h2 className="text-xl font-medium mb-1">
                    {file ? file.name : "Choose an audio file"}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Drag and drop your lecture recording (MP3, WAV, etc.)
                  </p>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 animate-shake">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <button
                  disabled={!file}
                  onClick={processAudio}
                  className="w-full mt-6 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  Generate Notes
                </button>
              </motion.div>
            ) : status === 'processing' ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-black animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-black opacity-10 animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium mb-2">Analyzing Audio</h2>
                    <p className="text-gray-400 max-w-xs mx-auto">
                      Gemini is transcribing and structuring your notes. This may take a minute...
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Actions */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-3 p-2 pl-4 pr-6 bg-white rounded-full shadow-sm border border-gray-100">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">
                      {file?.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={reset}
                      className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                    >
                      New Note
                    </button>
                    <button
                      onClick={downloadDoc}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-all active:scale-95"
                    >
                      <Download size={16} />
                      Download .docx
                    </button>
                  </div>
                </div>

                {/* Notes Preview */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 min-h-[400px]">
                  <div className="prose prose-slate max-w-none prose-headings:font-light prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-2xl prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
                    <Markdown>{notes}</Markdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer info */}
        <footer className="mt-12 text-center">
          <div className="flex items-center justify-center gap-6 opacity-30 invert">
             <FileAudio size={24} />
             <FileText size={24} />
          </div>
        </footer>
      </div>
    </div>
  );
}
