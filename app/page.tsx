'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Loader2, MapPin, Shield, AlertTriangle } from 'lucide-react';
import { Incident, Freguesia, Severity, severityLabels } from '@/types';
import { Badge } from '@/components/ui/badge';
import { IncidentList } from '@/components/incident-list';
import { getApprovedIncidents } from '@/lib/api';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

// Sample data for freguesias
const freguesias: Freguesia[] = [
  "Bonfim",
  "Campanhã",
  "Cedofeita",
  "Lordelo do Ouro",
  "Massarelos",
  "Paranhos",
  "Ramalde",
  "Santo Ildefonso",
  "São Nicolau",
  "Sé",
  "Vitória",
];

// Severity colors for badges
const severityColors: Record<Severity, string> = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
};

// Mock data for last report
const lastReportDate = new Date(2024, 2, 24); // March 24, 2024
const daysSinceLastReport = 3; // Fixed value instead of calculating
const lastReportIncidents = 23;

export default function HomePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFreguesia, setSelectedFreguesia] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const data = await getApprovedIncidents();
        setIncidents(data);
      } catch (err) {
        setError('Falha ao carregar incidentes. Por favor, tente novamente mais tarde.');
        console.error('Error fetching incidents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Filter incidents based on selected filters
  const filteredIncidents = incidents.filter(incident => {
    if (selectedFreguesia && selectedFreguesia !== "all" && incident.freguesia !== selectedFreguesia) {
      return false;
    }
    if (selectedSeverity && selectedSeverity !== "all" && incident.severity !== selectedSeverity) {
      return false;
    }
    return true;
  });

  return (
    <>
      <section className="py-12 md:py-16 text-center">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl mb-4">
            Mantendo as Ruas do Porto Seguras
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto mb-8">
            Acompanhe e reporte incidentes de segurança no Porto. Juntos podemos tornar a nossa cidade mais segura.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="/reportar" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Reportar Novo Incidente
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-dashed">
              <a href="/faq">Saiba Mais</a>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="my-2 border-dashed" />

      <section className="py-8">
        <div className="container mx-auto">
          <Card className="border-primary/20 bg-primary/5 border-dashed">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <InfoIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Relatórios Semanais</h3>
                  <p className="text-sm text-muted-foreground">
                    Relatórios são enviados à PSP, Câmara do Porto e Juntas de Freguesia. 
                    Último relatório: {lastReportDate.toLocaleDateString('pt-PT')} ({daysSinceLastReport} dias atrás) com {lastReportIncidents} incidentes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Incidentes Recentes</h2>
              <p className="text-muted-foreground">
                Visualize os incidentes reportados pelos cidadãos e aprovados pela nossa equipe.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Select value={selectedFreguesia} onValueChange={setSelectedFreguesia}>
                <SelectTrigger className="w-full sm:w-[180px] border-dashed">
                  <SelectValue placeholder="Freguesia" />
                </SelectTrigger>
                <SelectContent className="border-dashed">
                  <SelectItem value="all">Todas as Freguesias</SelectItem>
                  {freguesias.map((freguesia) => (
                    <SelectItem key={freguesia} value={freguesia}>
                      {freguesia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-full sm:w-[220px] border-dashed">
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent className="border-dashed">
                  <SelectItem value="all">Todas as Severidades</SelectItem>
                  {Object.entries(severityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">A carregar incidentes...</p>
              </div>
            </div>
          ) : error ? (
            <Card className="border-destructive/20 bg-destructive/5 p-6 border-dashed">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Card>
          ) : filteredIncidents.length === 0 ? (
            <Card className="border-muted/20 bg-muted/5 p-8 text-center border-dashed">
              <p className="text-muted-foreground">Nenhum incidente encontrado com os filtros selecionados.</p>
            </Card>
          ) : (
            <IncidentList incidents={filteredIncidents} />
          )}
        </div>
      </section>
    </>
  );
} 