import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Emotions and Care - Text Editor',
  authors: [{ name: 'Emotions and Care' }],
  keywords: ['text editor', 'emotions and care', 'text management'],
  description: 'A simple text editor for managing texts in the Emotions and Care application.',
  icons: {
    icon: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: 'Favicons/web/icon-192.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', url: 'Favicons/web/icon-192.png'},
      { rel: 'icon', type: 'image/png', sizes: '16x16', url: 'Favicons/web/icon-192.png' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#2CB5E0',
  other: {
    'msapplication-TileColor': '#2CB5E0',
    'msapplication-TileImage': 'Favicons/web/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
