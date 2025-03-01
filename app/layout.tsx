import { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const openSans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Rua Segura | Reportar e Acompanhar Incidentes no Porto',
    template: '%s | Rua Segura Porto'
  },
  description: 'Plataforma cidadã para reportar e acompanhar incidentes de segurança viária na cidade do Porto. Juntos por uma cidade mais segura.',
  keywords: ['segurança', 'Porto', 'incidentes', 'reportar', 'cidade', 'comunidade', 'segurança viária', 'cidadania'],
  authors: [{ name: 'Rua Segura' }],
  creator: 'Rua Segura',
  publisher: 'Collective Intelligence',
  metadataBase: new URL('https://www.ruasegura.pt'),
  alternates: {
    canonical: '/',
    languages: {
      'pt-PT': '/',
    },
  },
  openGraph: {
    title: 'Rua Segura | Reportar e Acompanhar Incidentes no Porto',
    description: 'Plataforma cidadã para reportar e acompanhar incidentes de segurança viária na cidade do Porto. Juntos por uma cidade mais segura.',
    url: 'https://www.ruasegura.pt',
    siteName: 'Rua Segura Porto',
    locale: 'pt_PT',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rua Segura Porto - Plataforma de segurança viária',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rua Segura | Reportar e Acompanhar Incidentes no Porto',
    description: 'Plataforma cidadã para reportar e acompanhar incidentes de segurança viária na cidade do Porto. Juntos por uma cidade mais segura.',
    images: ['/og-image.jpg'],
    creator: '@ruaseguraporto',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code when available
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={openSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto max-w-6xl py-10 px-4">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
} 