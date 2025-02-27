import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Incident, Severity, severityLabels } from "@/types"
import { Link } from "react-router-dom"

const severityColors: Record<Severity, string> = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
}

interface IncidentListProps {
  incidents: Incident[]
}

export function IncidentList({ incidents }: IncidentListProps) {
  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
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
                {new Date(incident.date).toLocaleDateString('pt-PT')} às {incident.time}
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
                  <Link to={`/incident/${incident.id}`}>Ver Detalhes</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}