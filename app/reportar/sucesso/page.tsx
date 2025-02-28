'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const incidentId = searchParams ? searchParams.get('id') : null;
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Incidente Reportado com Sucesso!</CardTitle>
        <CardDescription>
          Obrigado por contribuir para a segurança da nossa comunidade.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">
          O seu incidente foi submetido e será analisado pela nossa equipe.
        </p>
        {incidentId && (
          <p className="text-sm text-muted-foreground mb-4">
            ID do Incidente: <span className="font-mono">{incidentId}</span>
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Você será redirecionado para a página inicial em {countdown} segundos.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button asChild variant="outline">
          <Link href="/">Voltar à Página Inicial</Link>
        </Button>
        <Button asChild>
          <Link href="/">Ver Todos os Incidentes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SuccessPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Suspense fallback={
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Incidente Reportado com Sucesso!</CardTitle>
            <CardDescription>
              Carregando detalhes...
            </CardDescription>
          </CardHeader>
        </Card>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
} 