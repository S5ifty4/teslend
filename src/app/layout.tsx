import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = 'https://teslend.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Teslend: Rent Tesla Accessories in the Bay Area',
    template: '%s | Teslend',
  },
  description: 'Peer-to-peer Tesla accessory rentals in the San Francisco Bay Area. Rent roof racks, hitch racks, bike carriers, camping gear, and more from local Tesla owners.',
  keywords: ['Tesla accessories rental', 'Tesla roof rack rental', 'Tesla hitch rack', 'Bay Area Tesla', 'rent Tesla gear', 'Model Y accessories', 'Cybertruck accessories'],
  authors: [{ name: 'Teslend' }],
  creator: 'Teslend',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Teslend',
    title: 'Teslend: Rent Tesla Accessories in the Bay Area',
    description: 'Peer-to-peer Tesla accessory rentals in the San Francisco Bay Area. Rent roof racks, hitch racks, bike carriers, camping gear, and more from local Tesla owners.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Teslend — Bay Area Tesla Accessory Rentals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teslend: Rent Tesla Accessories in the Bay Area',
    description: 'P2P Tesla accessory rentals — roof racks, hitch racks, bike carriers, camping gear. Bay Area first.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
