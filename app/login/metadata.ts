import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Rua Segura Porto',
  description: 'Aceda à sua conta na plataforma Rua Segura para gerir incidentes de segurança viária no Porto.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Login | Rua Segura Porto',
    description: 'Aceda à sua conta na plataforma Rua Segura para gerir incidentes de segurança viária no Porto.',
    url: 'https://www.ruasegura.pt/login',
    type: 'website',
    images: [
      {
        url: '/og-login.jpg',
        width: 1200,
        height: 630,
        alt: 'Login na plataforma Rua Segura Porto',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login | Rua Segura Porto',
    description: 'Aceda à sua conta na plataforma Rua Segura para gerir incidentes de segurança viária no Porto.',
    images: ['/og-login.jpg'],
  },
}; 