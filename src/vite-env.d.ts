/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly GEMINI_API_KEY?: string;
  /** Max AI generations per browser per local day (default 20). Client-only; can be bypassed. */
  readonly VITE_DAILY_AI_REQUEST_LIMIT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
