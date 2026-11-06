export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-6 sm:min-h-[80vh] sm:px-6">
      {children}
    </div>
  );
}
