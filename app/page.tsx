'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Loader2 } from 'lucide-react';
import { Incident, Freguesia, Severity, severityLabels } from '@/types';
import { Badge } from '@/components/ui/badge';
import { IncidentList } from '@/components/incident-list';
import { getApprovedIncidents } from '@/lib/api';

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
      <div className="flex flex-col items-center text-center gap-2 mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
          Mantendo as Ruas do Porto Seguras
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px]">
          Acompanhe e reporte incidentes de segurança no Porto. Juntos podemos tornar a nossa cidade mais segura.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <a href="/reportar">Reportar Novo Incidente</a>
          </Button>
        </div>
      </div>

      <Alert className="mb-8">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Relatórios semanais são enviados à PSP, Câmara do Porto e Juntas de Freguesia. 
          Último relatório: {lastReportDate.toLocaleDateString('pt-PT')} ({daysSinceLastReport} dias atrás) com {lastReportIncidents} incidentes.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Incidentes Recentes</h2>
          <p className="text-muted-foreground">
            Visualize os incidentes reportados pelos cidadãos e aprovados pela nossa equipe.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedFreguesia} onValueChange={setSelectedFreguesia}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Freguesia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Freguesias</SelectItem>
              {freguesias.map((freguesia) => (
                <SelectItem key={freguesia} value={freguesia}>
                  {freguesia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Severidade" />
            </SelectTrigger>
            <SelectContent>
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
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredIncidents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum incidente encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <IncidentList incidents={filteredIncidents} />
      )}
    </>
  );
} 