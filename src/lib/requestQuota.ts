const STORAGE_KEY = 'audiotes_ai_daily_quota_v1';

export type QuotaStatus = {
  used: number;
  limit: number;
  remaining: number;
};

type StoredState = {
  dayKey: string;
  count: number;
};

function localDayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDailyRequestLimit(): number {
  const raw = import.meta.env.VITE_DAILY_AI_REQUEST_LIMIT;
  const n =
    raw !== undefined && raw !== '' && raw !== null ? Number(raw) : 20;
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(Math.floor(n), 50_000);
}

function readState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dayKey: localDayKey(), count: 0 };
    const parsed = JSON.parse(raw) as StoredState;
    if (typeof parsed.dayKey !== 'string' || typeof parsed.count !== 'number') {
      return { dayKey: localDayKey(), count: 0 };
    }
    return parsed;
  } catch {
    return { dayKey: localDayKey(), count: 0 };
  }
}

export function getQuotaStatus(): QuotaStatus {
  const limit = getDailyRequestLimit();
  const state = readState();
  const today = localDayKey();
  const used = state.dayKey === today ? state.count : 0;
  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
  };
}

/**
 * Reserves one generation attempt (counts before the API call to protect the key from retries).
 */
export function tryConsumeQuota():
  | { ok: true }
  | { ok: false; limit: number } {
  const limit = getDailyRequestLimit();
  const today = localDayKey();
  let state = readState();
  if (state.dayKey !== today) {
    state = { dayKey: today, count: 0 };
  }
  if (state.count >= limit) {
    return { ok: false, limit };
  }
  state = { dayKey: today, count: state.count + 1 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return { ok: true };
}
