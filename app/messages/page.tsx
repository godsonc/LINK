const THREADS = [
  {
    name: "Emma",
    preview: "I can help you look at the benefits form.",
    time: "Today",
  },
  {
    name: "Boston Community Pantry",
    preview: "Your visit is booked for Thursday.",
    time: "Tue",
  },
  {
    name: "Benefits Support Team",
    preview: "Please bring a photo of your tenancy letter.",
    time: "Mon",
  },
];

export default function MessagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted">
          Sample conversations, so you can see how messages will look. Nothing
          here is sent.
        </p>
      </div>
      <ul className="divide-y divide-line/10 overflow-hidden rounded-card bg-paper shadow-card">
        {THREADS.map((thread) => (
          <li key={thread.name}>
            <div className="flex items-start gap-3 px-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 font-semibold text-brand">
                {thread.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{thread.name}</span>
                  <span className="text-xs text-muted">{thread.time}</span>
                </span>
                <span className="mt-1 block truncate text-sm text-muted">
                  {thread.preview}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
