'use client';

import { Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContactoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Contacte-nos</h1>
      
      <p className="text-muted-foreground mb-8">
        Tem alguma dúvida, sugestão ou feedback? Estamos aqui para ajudar.
        Entre em contacto connosco através do nosso email.
      </p>
      
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center space-x-3 p-6 bg-muted rounded-lg">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-medium text-lg">Email</h3>
              <a 
                href="mailto:contacto@ruasegura.pt" 
                className="text-primary hover:underline"
              >
                contacto@ruasegura.pt
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                Respondemos a todos os emails dentro de 24-48 horas em dias úteis.
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Emergências</h3>
            <p className="text-sm text-muted-foreground">
              Para situações de emergência, contacte diretamente as autoridades:<br />
              <strong>112</strong> (Número Europeu de Emergência)<br />
              <strong>222 092 000</strong> (PSP Porto)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 