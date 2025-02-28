import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Associações Parceiras | Rua Segura Porto',
  description: 'Conheça as associações e organizações parceiras que colaboram com o Rua Segura para melhorar a segurança viária no Porto.',
  openGraph: {
    title: 'Associações Parceiras | Rua Segura Porto',
    description: 'Conheça as associações e organizações parceiras que colaboram com o Rua Segura para melhorar a segurança viária no Porto.',
    url: 'https://www.ruasegura.pt/associacoes',
    type: 'website',
    images: [
      {
        url: '/og-associations.jpg',
        width: 1200,
        height: 630,
        alt: 'Associações parceiras do Rua Segura Porto',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Associações Parceiras | Rua Segura Porto',
    description: 'Conheça as associações e organizações parceiras que colaboram com o Rua Segura para melhorar a segurança viária no Porto.',
    images: ['/og-associations.jpg'],
  },
}; 