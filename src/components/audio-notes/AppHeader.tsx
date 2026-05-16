import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';

export function AppHeader() {
  return (
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
        Bium Audio <span className="font-semibold text-black">AI</span>
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
  );
}
