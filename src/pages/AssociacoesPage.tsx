import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export function AssociacoesPage() {
  return (
    <div className="container max-w-4xl py-10">
      <Helmet>
        <title>Associações Parceiras | Rua Segura Porto</title>
        <meta name="description" content="Conheça as associações parceiras que colaboram com a Rua Segura para tornar o Porto uma cidade mais segura." />
        <meta property="og:title" content="Associações Parceiras | Rua Segura Porto" />
        <meta property="og:description" content="Conheça as associações parceiras que colaboram com a Rua Segura para tornar o Porto uma cidade mais segura." />
      </Helmet>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Associações Parceiras</h1>
        <p className="text-muted-foreground max-w-[700px] mx-auto">
          Trabalhamos em conjunto com associações locais para promover a segurança e o bem-estar da comunidade do Porto.
          Conheça os nossos parceiros e saiba como eles contribuem para a nossa missão.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Associação Marechal Gomes da Costa (AMBGC)</CardTitle>
            <CardDescription>
              Associação de moradores dedicada a melhorar a qualidade de vida na zona da Avenida Marechal Gomes da Costa.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3 flex justify-center">
                <img 
                  src="/images/associations/307566422_464692985690743_6462365139014777670_n.jpg" 
                  alt="Logo da Associação Marechal Gomes da Costa" 
                  className="rounded-lg max-h-48 object-contain"
                />
              </div>
              <div className="w-full md:w-2/3">
                <p className="mb-4">
                  A Associação Marechal Gomes da Costa (AMBGC) é uma organização comunitária que representa os interesses dos 
                  moradores da zona da Avenida Marechal Gomes da Costa e áreas circundantes no Porto.
                </p>
                <p className="mb-4">
                  Fundada com o objetivo de promover a segurança, o bem-estar e a qualidade de vida dos residentes, 
                  a AMBGC trabalha ativamente na identificação e resolução de problemas locais, incluindo questões de segurança pública.
                </p>
                <p>
                  A associação colabora com a Rua Segura na recolha e partilha de informações sobre incidentes de segurança, 
                  contribuindo para uma resposta mais eficaz às preocupações da comunidade.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-4">
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://www.facebook.com/AMBMGC/?locale=pt_PT" target="_blank" rel="noopener noreferrer">
                Visitar Página <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 