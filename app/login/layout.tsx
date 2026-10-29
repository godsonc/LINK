export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-4">
      {children}
    </div>
  );
}
