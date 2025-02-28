'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, MapPin, Calendar, FileText, User, Home, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';
import { getIncidentById } from '@/lib/api';
import { Incident, severityLabels, Severity } from '@/types';
import { Separator } from '@/components/ui/separator';

const severityColors: Record<Severity, string> = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const statusColors: Record<string, string> = {
  approved: "bg-green-500/10 text-green-700 dark:text-green-400",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  approved: "Aprovado",
  pending: "Pendente",
  rejected: "Rejeitado",
};

export default function IncidentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id) {
          setError('ID do incidente não encontrado.');
          setLoading(false);
          return;
        }
        
        const data = await getIncidentById(id);
        setIncident(data);
      } catch (err) {
        console.error('Error fetching incident:', err);
        setError('Não foi possível carregar os detalhes do incidente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncident();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">A carregar detalhes do incidente...</p>
      </div>
    );
  }
  
  if (error || !incident) {
    return (
      <div className="container mx-auto py-12">
        <Card className="border-destructive/20 bg-destructive/5 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">Erro</h3>
                <p className="text-sm text-muted-foreground">
                  {error || 'Incidente não encontrado.'}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pb-6 pt-0">
            <Button asChild variant="outline" className="border-dashed">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para a página inicial
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 flex items-center justify-between">
        <Button asChild variant="outline" size="sm" className="border-dashed">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <Badge variant="outline" className={`${statusColors[incident.status]} border-dashed`}>
          {statusLabels[incident.status]}
        </Badge>
      </div>
      
      <Card className="overflow-hidden border-dashed">
        <CardHeader className="pb-4 border-b border-dashed">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1.5 text-sm">
                <Clock className="h-3.5 w-3.5" />
                {new Date(incident.date).toLocaleDateString('pt-PT')}
              </CardDescription>
              <Badge variant="outline" className={`${severityColors[incident.severity]} border-dashed`}>
                {severityLabels[incident.severity]}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              {incident.location}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-3.5 w-3.5" />
              <span>Freguesia: {incident.freguesia}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-8">
          <div className="grid gap-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Tipo de Incidente
                </h3>
                <p className="text-sm">{incident.type}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-1.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Reportado por
                </h3>
                <p className="text-sm">{incident.reporterName}</p>
              </div>
            </div>
            
            <Separator className="border-dashed" />
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Descrição</h3>
              <div className="bg-muted/40 p-4 rounded-md border border-dashed border-border">
                <p className="text-sm whitespace-pre-line">{incident.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 