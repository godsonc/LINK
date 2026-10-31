"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMessages } from "@/components/useMessages";
import { formatMessageTime } from "@/lib/messages";

export default function MessageDetailPage() {
  const params = useParams<{ id: string }>();
  const { ready, items } = useMessages();
  const thread = items.find((item) => item.id === params.id);

  if (!ready) return <p className="text-muted">Loading message…</p>;
  if (!thread) return <p>We could not find that message.</p>;

  return (
    <article className="space-y-4">
      <div className="rounded-card bg-paper p-4 shadow-card">
        <p className="text-sm text-muted">{formatMessageTime(thread.at)}</p>
        <h2 className="mt-1 text-xl font-semibold">{thread.from}</h2>
        <p className="mt-4 whitespace-pre-wrap leading-relaxed">{thread.body}</p>
      </div>
      <Link href="/messages" className="font-medium text-brand">
        Back to messages
      </Link>
    </article>
  );
}
