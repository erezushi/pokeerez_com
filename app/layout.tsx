import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './ui/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: 'PokéErez - %s',
    default: 'PokéErez',
  },
  description: 'Official website for Pokétuber and streamer PokéErez.',
  keywords: [
    'Erez',
    'PokeErez',
    'ErOr Bros.',
    'social',
    'YouTube',
    'Twitch',
    'Twitter',
    'Bluesky',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="main-page">{children}</div>
      </body>
    </html>
  );
}
