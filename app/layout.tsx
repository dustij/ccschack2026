import type { Metadata } from 'next';
import { Bangers, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const bangers = Bangers({
  variable: '--font-bangers',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Model Mayhem',
  description:
    'One prompt. Multiple AI agents. No adult supervision. Watch them argue over who deserves to respond, spiral into feedback loops, or abandon logic entirely when “flirt mode” is enabled.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
