import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import WaveBackground from "@/components/ui/WaveBackground";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "memoire-Journal | AI-Powered Graph Memory",
  description: "Every thought is a node. Every day, a constellation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${dmSans.variable} antialiased selection:bg-ocean/30`}
      >
        <WaveBackground />
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
