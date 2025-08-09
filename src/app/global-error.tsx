"use client";

import { DM_Sans } from "next/font/google";

import { ThemeProvider } from "./components/theme-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
});

export default function GlobalError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <title>Error</title>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="centered-main">
            <h2 className="mb-5 text-center text-3xl font-bold">Error ⚠️</h2>
            <p className="max-w-100 text-center text-xl">
              A major error has occurred. Please contact Michael from the Tech
              team if the issue persists.
            </p>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
