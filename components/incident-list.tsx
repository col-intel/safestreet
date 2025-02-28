import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Incident, Severity, severityLabels } from "@/types"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const severityColors: Record<Severity, string> = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
}

interface IncidentListProps {
  incidents: Incident[]
}

export function IncidentList({ incidents }: IncidentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(incidents.length / itemsPerPage);
  
  // Get current incidents
  const indexOfLastIncident = currentPage * itemsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - itemsPerPage;
  const currentIncidents = incidents.slice(indexOfFirstIncident, indexOfLastIncident);
  
  // Change page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {currentIncidents.map((incident) => (
          <Card key={incident.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-lg font-medium">
                  {incident.location}
                </CardTitle>
                <Badge variant="outline" className={severityColors[incident.severity]}>
                  {severityLabels[incident.severity]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">
                  {new Date(incident.date).toLocaleDateString('pt-PT')}
                </div>
                <div className="text-sm">{incident.description}</div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Reportado por {incident.reporterName}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{incident.freguesia}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/incidente/${incident.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      )}
    </div>
  )
} 