import type { ReactNode } from 'react';

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-gray-900 py-12 px-4 selection:bg-black selection:text-white">
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
}
