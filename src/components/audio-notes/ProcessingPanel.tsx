import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export function ProcessingPanel() {
  return (
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
          <div className="absolute inset-0 blur-xl bg-black opacity-10 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-medium mb-2">Analyzing Audio</h2>
          <p className="text-gray-400 max-w-xs mx-auto">
            Bium audio AI is transcribing and structuring your notes. This may
            take a minute...
          </p>
        </div>
      </div>
    </motion.div>
  );
}
