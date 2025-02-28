import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rua Segura Porto',
  description: 'Plataforma para reportar e acompanhar incidentes de segurança na cidade do Porto',
  metadataBase: new URL('https://www.ruasegura.pt'),
  openGraph: {
    title: 'Rua Segura Porto',
    description: 'Plataforma para reportar e acompanhar incidentes de segurança na cidade do Porto',
    url: 'https://www.ruasegura.pt',
    siteName: 'Rua Segura Porto',
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rua Segura Porto',
    description: 'Plataforma para reportar e acompanhar incidentes de segurança na cidade do Porto',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto max-w-4xl py-8 px-4">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 