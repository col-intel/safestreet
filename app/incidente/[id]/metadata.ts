import { Metadata, ResolvingMetadata } from 'next';
import { getIncidentById } from '@/lib/api';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch incident data
  const id = params.id;
  const incident = await getIncidentById(id);
  
  // Fallback values if incident not found
  if (!incident) {
    return {
      title: 'Incidente Não Encontrado | Rua Segura Porto',
      description: 'O incidente que procura não foi encontrado na nossa plataforma.',
    };
  }
  
  // Format date for display
  const formattedDate = new Date(incident.date).toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Create a descriptive title and description
  const title = `Incidente em ${incident.freguesia}: ${incident.type} | Rua Segura Porto`;
  const description = `Detalhes do incidente de ${incident.type.toLowerCase()} reportado em ${incident.location}, ${incident.freguesia} em ${formattedDate}. Severidade: ${incident.severity}.`;
  
  // Get base URL from parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const metadataBase = (await parent).metadataBase || new URL('https://www.ruasegura.pt');
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${metadataBase}/incidente/${id}`,
      type: 'article',
      publishedTime: incident.date,
      authors: ['Rua Segura'],
      images: [
        {
          // Use dynamic OG image generation with incident details
          url: `${metadataBase}/api/og?title=${encodeURIComponent(`Incidente em ${incident.freguesia}`)}&description=${encodeURIComponent(`${incident.type} - ${formattedDate}`)}&type=incident`,
          width: 1200,
          height: 630,
          alt: `Incidente em ${incident.freguesia}: ${incident.type}`,
        },
        // Fallback to static image
        {
          url: '/og-incident.jpg',
          width: 1200,
          height: 630,
          alt: `Incidente em ${incident.freguesia}: ${incident.type}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        `${metadataBase}/api/og?title=${encodeURIComponent(`Incidente em ${incident.freguesia}`)}&description=${encodeURIComponent(`${incident.type} - ${formattedDate}`)}&type=incident`,
        '/og-incident.jpg',
      ],
    },
  };
} 