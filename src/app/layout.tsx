import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cat Petter",
  description: "A minimal cat petting clicker game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
