import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// BMGC association data
const association = {
  name: "Associação de Moradores Marechal Gomes da Costa (BMGC)",
  description: "Associação dedicada a representar e defender os interesses dos moradores da área Marechal Gomes da Costa no Porto.",
  services: ["Representação comunitária", "Iniciativas locais", "Melhoria da qualidade de vida"],
  contact: "info@bmgc.pt",
  website: "https://bmgc.pt"
};

export default function AssociacoesPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Associações Parceiras</h1>
      
      <p className="text-muted-foreground mb-8">
        Conheça a associação que trabalha em parceria conosco para tornar o Porto uma cidade mais segura e inclusiva.
      </p>
      
      <div className="max-w-2xl mx-auto">
        <Card className="h-full flex flex-col">
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
      </div>
    </div>
  );
} 