import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Rua Segura Porto',
  description: 'Entre em contacto com a equipa do Rua Segura para dúvidas, sugestões ou parcerias relacionadas com a segurança viária no Porto.',
  openGraph: {
    title: 'Contacto | Rua Segura Porto',
    description: 'Entre em contacto com a equipa do Rua Segura para dúvidas, sugestões ou parcerias relacionadas com a segurança viária no Porto.',
    url: 'https://www.ruasegura.pt/contacto',
    type: 'website',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contacte a equipa do Rua Segura Porto',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto | Rua Segura Porto',
    description: 'Entre em contacto com a equipa do Rua Segura para dúvidas, sugestões ou parcerias relacionadas com a segurança viária no Porto.',
    images: ['/og-contact.jpg'],
  },
}; 