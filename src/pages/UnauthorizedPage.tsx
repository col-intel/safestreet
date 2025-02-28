import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="container max-w-md py-10">
      <Alert variant="destructive" className="mb-6">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Acesso Não Autorizado</AlertTitle>
        <AlertDescription>
          Você precisa estar autenticado como administrador para acessar esta página.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col gap-4">
        <Button asChild variant="default">
          <Link to="/login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Fazer Login
          </Link>
        </Button>
        
        <Button asChild variant="outline">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a Página Inicial
          </Link>
        </Button>
      </div>
    </div>
  );
} 