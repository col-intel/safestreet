import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rua Segura | Plataforma Cidadã para Segurança Viária no Porto',
  description: 'Reporte e acompanhe incidentes de segurança viária no Porto. Uma iniciativa cidadã para tornar as ruas do Porto mais seguras para todos.',
  openGraph: {
    title: 'Rua Segura | Plataforma Cidadã para Segurança Viária no Porto',
    description: 'Reporte e acompanhe incidentes de segurança viária no Porto. Uma iniciativa cidadã para tornar as ruas do Porto mais seguras para todos.',
    url: 'https://www.ruasegura.pt',
    type: 'website',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Rua Segura - Plataforma cidadã para segurança viária no Porto',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rua Segura | Plataforma Cidadã para Segurança Viária no Porto',
    description: 'Reporte e acompanhe incidentes de segurança viária no Porto. Uma iniciativa cidadã para tornar as ruas do Porto mais seguras para todos.',
    images: ['/og-home.jpg'],
  },
}; 