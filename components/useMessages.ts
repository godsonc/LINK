"use client";

import { useEffect, useState } from "react";
import {
  MESSAGES_CHANGE_EVENT,
  type MessageThread,
  loadMessages,
} from "@/lib/messages";

export function useMessages() {
  const [items, setItems] = useState<MessageThread[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function refresh() {
      setItems(loadMessages());
      setReady(true);
    }
    refresh();
    window.addEventListener(MESSAGES_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(MESSAGES_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { ready, items };
}
