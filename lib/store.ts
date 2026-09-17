import type { BoardState, SessionState } from "./types";

const SESSION_KEY = "link-session";
const BOARD_KEY = "link-board";

export const emptySession = (): SessionState => ({
  story: "",
  locality: "skegness",
  answers: {},
  classified: [],
  selectedNeeds: [],
  matches: [],
  pathway: [],
  nextSteps: [],
  safeguarding: false,
  safeguardingAcknowledged: false,
  referrals: [],
});

export const emptyBoard = (): BoardState => ({
  referrals: [],
  cases: [],
  audit: [],
  serviceOverrides: {},
});

export function loadSession(): SessionState {
  if (typeof window === "undefined") return emptySession();
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? { ...emptySession(), ...JSON.parse(raw) } : emptySession();
  } catch {
    return emptySession();
  }
}

export function saveSession(session: SessionState) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadBoard(): BoardState {
  if (typeof window === "undefined") return emptyBoard();
  try {
    const raw = window.localStorage.getItem(BOARD_KEY);
    return raw ? { ...emptyBoard(), ...JSON.parse(raw) } : emptyBoard();
  } catch {
    return emptyBoard();
  }
}

export function saveBoard(board: BoardState) {
  window.localStorage.setItem(BOARD_KEY, JSON.stringify(board));
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function logEvent(board: BoardState, kind: string, detail: string): BoardState {
  return {
    ...board,
    audit: [
      { id: newId("evt"), at: new Date().toISOString(), kind, detail },
      ...board.audit,
    ].slice(0, 80),
  };
}
