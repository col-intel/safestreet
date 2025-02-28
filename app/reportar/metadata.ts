import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reportar Incidente | Rua Segura Porto',
  description: 'Reporte incidentes de segurança viária no Porto. Contribua para uma cidade mais segura ao identificar problemas nas ruas da sua comunidade.',
  openGraph: {
    title: 'Reportar Incidente | Rua Segura Porto',
    description: 'Reporte incidentes de segurança viária no Porto. Contribua para uma cidade mais segura ao identificar problemas nas ruas da sua comunidade.',
    url: 'https://www.ruasegura.pt/reportar',
    type: 'website',
    images: [
      {
        url: '/og-report.jpg',
        width: 1200,
        height: 630,
        alt: 'Formulário para reportar incidentes de segurança viária no Porto',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reportar Incidente | Rua Segura Porto',
    description: 'Reporte incidentes de segurança viária no Porto. Contribua para uma cidade mais segura ao identificar problemas nas ruas da sua comunidade.',
    images: ['/og-report.jpg'],
  },
}; 