import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Sample data for associations
const associations = [
  {
    name: "Associação Portuguesa de Apoio à Vítima (APAV)",
    description: "Apoia vítimas de crime, suas famílias e amigos, prestando serviços gratuitos e confidenciais.",
    services: ["Apoio emocional", "Informação jurídica", "Encaminhamento social"],
    contact: "116 006 (Linha de Apoio à Vítima)",
    website: "https://apav.pt"
  },
  {
    name: "PSP - Polícia de Segurança Pública",
    description: "Força de segurança responsável pelo policiamento das áreas urbanas em Portugal.",
    services: ["Segurança pública", "Investigação criminal", "Prevenção"],
    contact: "112 (Emergência) / 222 092 000 (Comando Metropolitano do Porto)",
    website: "https://www.psp.pt"
  },
  {
    name: "Câmara Municipal do Porto",
    description: "Órgão executivo do município, responsável pela gestão quotidiana e planeamento estratégico da cidade.",
    services: ["Políticas de segurança", "Planeamento urbano", "Serviços municipais"],
    contact: "222 097 000",
    website: "https://www.cm-porto.pt"
  },
  {
    name: "Juntas de Freguesia do Porto",
    description: "Órgãos executivos das freguesias, que trabalham em proximidade com os cidadãos.",
    services: ["Serviços de proximidade", "Apoio comunitário", "Gestão local"],
    contact: "Varia conforme a freguesia",
    website: "https://www.cm-porto.pt/freguesias"
  },
  {
    name: "SOS Racismo",
    description: "Associação que combate o racismo e a discriminação em Portugal.",
    services: ["Apoio a vítimas de discriminação", "Sensibilização", "Educação"],
    contact: "213 420 000",
    website: "https://www.sosracismo.pt"
  },
  {
    name: "Associação Plano i",
    description: "Promove a igualdade de género e combate à discriminação.",
    services: ["Apoio a vítimas LGBTI+", "Formação", "Intervenção comunitária"],
    contact: "222 085 387",
    website: "https://www.associacaoplanoi.org"
  }
];

export default function AssociacoesPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Associações e Entidades Parceiras</h1>
      
      <p className="text-muted-foreground mb-8">
        Conheça as associações e entidades que trabalham para tornar o Porto uma cidade mais segura e inclusiva.
        Estas organizações oferecem apoio especializado em diversas áreas relacionadas à segurança pública e bem-estar social.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {associations.map((association, index) => (
          <Card key={index} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{association.name}</CardTitle>
              <CardDescription>{association.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <h3 className="font-medium mb-2">Serviços:</h3>
              <ul className="list-disc pl-5 mb-4">
                {association.services.map((service, idx) => (
                  <li key={idx}>{service}</li>
                ))}
              </ul>
              <p className="text-sm">
                <strong>Contacto:</strong> {association.contact}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <a href={association.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  Visitar Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Quer sugerir uma associação?</h2>
        <p className="mb-4">
          Se conhece uma associação ou entidade que trabalha na área da segurança pública ou apoio a vítimas no Porto
          e gostaria de vê-la listada aqui, entre em contacto connosco.
        </p>
        <Button asChild>
          <a href="/contacto">Contacte-nos</a>
        </Button>
      </div>
    </div>
  );
} 