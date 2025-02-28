import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes (FAQ) | Rua Segura Porto',
  description: 'Encontre respostas para as perguntas mais comuns sobre a plataforma Rua Segura e como reportar incidentes de segurança viária no Porto.',
  openGraph: {
    title: 'Perguntas Frequentes (FAQ) | Rua Segura Porto',
    description: 'Encontre respostas para as perguntas mais comuns sobre a plataforma Rua Segura e como reportar incidentes de segurança viária no Porto.',
    url: 'https://www.ruasegura.pt/faq',
    type: 'website',
    images: [
      {
        url: '/og-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'Perguntas Frequentes sobre a plataforma Rua Segura Porto',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perguntas Frequentes (FAQ) | Rua Segura Porto',
    description: 'Encontre respostas para as perguntas mais comuns sobre a plataforma Rua Segura e como reportar incidentes de segurança viária no Porto.',
    images: ['/og-faq.jpg'],
  },
}; 