import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Incident, Severity, severityLabels } from "@/types"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, Calendar, User, ArrowRight } from "lucide-react"
import { Separator } from "./ui/separator"

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
    <div className="space-y-8">
      <div className="grid gap-6">
        {currentIncidents.map((incident) => (
          <Card key={incident.id} className="overflow-hidden transition-all hover:shadow-md border-dashed">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <CardTitle className="text-xl font-medium">
                    {incident.location}
                  </CardTitle>
                </div>
                <Badge variant="outline" className={`${severityColors[incident.severity]} ml-0 sm:ml-auto border-dashed`}>
                  {severityLabels[incident.severity]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(incident.date).toLocaleDateString('pt-PT')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>{incident.reporterName}</span>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded-full bg-muted text-xs border border-dashed border-border">
                      {incident.freguesia}
                    </span>
                  </div>
                </div>
                
                <Separator className="border-dashed" />
                
                <div className="text-sm">
                  {incident.description.length > 150 
                    ? `${incident.description.substring(0, 150)}...` 
                    : incident.description}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="ml-auto border-dashed"
              >
                <Link href={`/incidente/${incident.id}`} className="flex items-center gap-1.5">
                  Ver Detalhes
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 border-dashed"
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
                className={`h-8 w-8 p-0 ${currentPage !== page ? "border-dashed" : ""}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 border-dashed"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      )}
    </div>
  )
} 