import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Novaforge",
  description: "Prompt-driven circuit generation studio with structured outputs and a focused design workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
