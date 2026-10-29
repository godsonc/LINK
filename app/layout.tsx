import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LinkProvider } from "@/lib/link-context";
import { AppShell } from "@/components/AppShell";
import { getAuthUser } from "@/lib/supabase/user";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LINK — Lincolnshire Inclusion & Navigation Network",
  description:
    "From need to opportunity. Describe your situation and receive a local support pathway.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getAuthUser();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <AuthProvider initialUser={initialUser}>
          <LinkProvider>
            <AppShell>{children}</AppShell>
          </LinkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
