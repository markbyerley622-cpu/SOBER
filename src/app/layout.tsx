import type { Metadata, Viewport } from 'next';
import { WalletContextProvider } from '@/context/WalletContext';
import { AppProvider } from '@/context/AppContext';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://soberfun.io'),
  title: 'SOBER MADE FUN | Earn SOL for Staying Sober',
  description:
    'Get rewarded for staying sober. Complete tasks, earn SOL directly to your Solana wallet, and join a supportive community on your wellness journey. Privacy-first, community-driven.',
  keywords: [
    'sobriety',
    'wellness',
    'Solana',
    'SOL rewards',
    'crypto rewards',
    'accountability',
    'recovery',
    'web3',
    'sobriety rewards',
  ],
  authors: [{ name: 'SOBER MADE FUN' }],
  openGraph: {
    title: 'SOBER MADE FUN | Earn SOL for Staying Sober',
    description:
      'Get rewarded for staying sober. Complete tasks, earn SOL directly to your Solana wallet.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SOBER MADE FUN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOBER MADE FUN | Earn SOL for Staying Sober',
    description:
      'Get rewarded for staying sober. Complete tasks, earn SOL.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <WalletContextProvider>
          <AppProvider>{children}</AppProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
