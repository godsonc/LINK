import { newId } from "./store";

export type MessageThread = {
  id: string;
  from: string;
  preview: string;
  body: string;
  at: string;
};

const STORAGE_KEY = "link-messages";
export const MESSAGES_CHANGE_EVENT = "link-messages-change";

export function loadMessages(): MessageThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MessageThread[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(threads: MessageThread[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  window.dispatchEvent(new Event(MESSAGES_CHANGE_EVENT));
}

export function appendMessage(input: {
  from: string;
  preview: string;
  body: string;
}) {
  const thread: MessageThread = {
    id: newId("msg"),
    at: new Date().toISOString(),
    ...input,
  };
  saveMessages([thread, ...loadMessages()].slice(0, 50));
  return thread;
}

export function formatMessageTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (sameDay) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}
