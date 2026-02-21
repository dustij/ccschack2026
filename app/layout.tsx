import type { Metadata } from 'next';
import { Geist, Geist_Mono, Black_Ops_One } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const blackOpsOne = Black_Ops_One({
  variable: '--font-black-ops',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Model Mayhem — AI Roast Battle',
  description: 'Three AI fighters. One prompt. Pure chaos. Watch Grok, Gemini, and Llama roast each other in real-time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${blackOpsOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
