import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MWONET | Maanisha Organization Network",
  description: "Official website of MWONET, an NGO working to create positive impact through community-focused programs and partnerships.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
