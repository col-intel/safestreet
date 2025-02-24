import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IncidentList } from "@/components/incident-list"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Incident, Freguesia } from "@/types"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data - replace with actual data from your backend
const sampleIncidents: Incident[] = [
  {
    id: "1",
    date: "2025-03-20",
    time: "14:30",
    location: "Rua de Santa Catarina",
    freguesia: "Santo Ildefonso",
    description: "Atividade suspeita perto da entrada do metro",
    type: "Atividade Suspeita",
    severity: "medium",
    reporterName: "João",
    status: "approved",
  },
  {
    id: "2",
    date: "2025-03-20",
    time: "16:45",
    location: "Rua das Flores",
    freguesia: "Sé",
    description: "Tentativa de furto reportada próximo à área turística",
    type: "Furto",
    severity: "high",
    reporterName: "Maria",
    status: "approved",
  },
  {
    id: "3",
    date: "2025-03-19",
    time: "09:15",
    location: "Avenida dos Aliados",
    freguesia: "Santo Ildefonso",
    description: "Vandalismo em mobiliário urbano",
    type: "Vandalismo",
    severity: "medium",
    reporterName: "Ana",
    status: "approved",
  },
  {
    id: "4",
    date: "2025-03-19",
    time: "22:30",
    location: "Jardim do Passeio Alegre",
    freguesia: "Foz do Douro",
    description: "Grupo suspeito reunido no jardim após o horário de fecho",
    type: "Atividade Suspeita",
    severity: "low",
    reporterName: "Pedro",
    status: "approved",
  },
]

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
]

// Mock data for last report
const lastReportDate = new Date(2024, 2, 24) // March 24, 2024
const daysSinceLastReport = 3 // Fixed value instead of calculating
const lastReportIncidents = 23

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="rua-segura-theme">
      <div className="min-h-screen flex flex-col relative">
        <Header />
        <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="flex flex-col items-center text-center gap-2 mb-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
              Mantendo as Ruas do Porto Seguras
            </h1>
            <p className="text-lg text-muted-foreground max-w-[700px]">
              Acompanhe e reporte incidentes de segurança no Porto. Juntos podemos tornar a nossa cidade mais segura.
            </p>
          </div>

          <Alert className="mb-8">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Relatórios semanais são enviados à PSP, Câmara do Porto e Juntas de Freguesia. 
              Último relatório enviado há {daysSinceLastReport} dias, incluindo {lastReportIncidents} incidentes.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por Freguesia" />
              </SelectTrigger>
              <SelectContent>
                {freguesias.map((freguesia) => (
                  <SelectItem key={freguesia} value={freguesia}>
                    {freguesia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-[180px]">
                  <span>Filtrar por Gravidade</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem className="gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                    Baixo
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                    Médio
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400">
                    Alto
                  </Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A]"
            >
              Reportar Incidente por WhatsApp
            </Button>
          </div>

          <div className="space-y-8">
            {Object.entries(
              sampleIncidents.reduce((acc, incident) => {
                const date = incident.date;
                if (!acc[date]) acc[date] = [];
                acc[date].push(incident);
                return acc;
              }, {} as Record<string, Incident[]>)
            ).map(([date, incidents]) => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <time className="text-sm font-medium text-muted-foreground">
                    {new Date(date).toLocaleDateString('pt-PT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <IncidentList incidents={incidents} />
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App