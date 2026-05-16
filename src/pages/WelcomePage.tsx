import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileAudio, Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';

export function WelcomePage() {
  return (
    <PageShell>
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-black text-white rounded-2xl mb-6"
        >
          <Sparkles size={28} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="text-4xl md:text-5xl font-light tracking-tight mb-4"
        >
          Welcome to{' '}
          <span className="font-semibold text-black">Bium Audio AI</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed"
        >
          Turn recordings of lectures, meetings, or study sessions into
          structured, detailed notes you can review, search, and export.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 space-y-8"
      >
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            What it does
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-black">
                <FileAudio size={20} />
              </span>
              <div>
                <p className="font-medium text-gray-900">Audio in, notes out</p>
                <p className="text-gray-500 text-sm mt-1">
                  Upload an audio file; the app uses AI to transcribe and expand
                  the content into thorough study-style notes—not a thin
                  summary.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-black">
                <BookOpen size={20} />
              </span>
              <div>
                <p className="font-medium text-gray-900">Built for learners</p>
                <p className="text-gray-500 text-sm mt-1">
                  Notes are organized with clear sections: overview, narrative,
                  concepts, glossary, and study questions so you can catch up
                  when you miss class.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-black">
                <Sparkles size={20} />
              </span>
              <div>
                <p className="font-medium text-gray-900">Export when you’re done</p>
                <p className="text-gray-500 text-sm mt-1">
                  When generation finishes, preview Markdown in the app and
                  download a Word (.docx) file for editing or sharing.
                </p>
              </div>
            </li>
          </ul>
        </section>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            You’ll need a valid Gemini API key configured for the app to run
            generations.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-all active:scale-[0.98] shrink-0"
          >
            Continue to the app
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>

      <p className="text-center text-gray-400 text-sm mt-8">Made by @techbium</p>
    </PageShell>
  );
}
