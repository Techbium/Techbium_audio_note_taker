import { FileAudio, FileText } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="mt-12 text-center">
      <div className="flex items-center justify-center gap-6 opacity-30 invert">
        <FileAudio size={24} />
        <FileText size={24} />
      </div>
    </footer>
  );
}
