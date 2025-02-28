'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, MapPin, Calendar, FileText, User, Home } from 'lucide-react';
import Link from 'next/link';
import { getIncidentById } from '@/lib/api';
import { Incident, severityLabels, Severity } from '@/types';

const severityColors: Record<Severity, string> = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
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
      <div className="container mx-auto max-w-4xl py-12 px-4 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>A carregar detalhes do incidente...</span>
        </div>
      </div>
    );
  }
  
  if (error || !incident) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <Alert className="mb-6 bg-red-500/10">
          <AlertDescription>
            {error || 'Incidente não encontrado.'}
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold">
              {incident.location}
            </CardTitle>
            <Badge variant="outline" className={severityColors[incident.severity]}>
              {severityLabels[incident.severity]}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Localização</h3>
                <p>{incident.location}</p>
                <p className="text-sm text-muted-foreground">Freguesia: {incident.freguesia}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Data</h3>
                <p>{new Date(incident.date).toLocaleDateString('pt-PT')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Tipo de Incidente</h3>
                <p>{incident.type}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Reportado por</h3>
                <p>{incident.reporterName}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Descrição</h3>
            <p className="whitespace-pre-line">{incident.description}</p>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Estado</h3>
            <Badge variant={incident.status === 'approved' ? 'default' : 'outline'}>
              {incident.status === 'approved' ? 'Aprovado' : 
               incident.status === 'pending' ? 'Pendente' : 'Rejeitado'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 