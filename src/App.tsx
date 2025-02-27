import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Routes, Route } from "react-router-dom"
import { IncidentList } from "@/components/incident-list"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Loader2 } from "lucide-react"
import { Incident, Freguesia, Severity, severityLabels } from "@/types"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SubmitIncidentPage } from "@/pages/SubmitIncident"
import { AdminPage } from "@/pages/AdminPage"
import { useState, useEffect } from "react"
import { getApprovedIncidents } from "@/lib/api"
import { Link, useParams } from "react-router-dom"

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
]

// Severity colors for badges
const severityColors: Record<Severity, string> = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
}

// Mock data for last report
const lastReportDate = new Date(2024, 2, 24) // March 24, 2024
const daysSinceLastReport = 3 // Fixed value instead of calculating
const lastReportIncidents = 23

function HomePage() {
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
      </div>

      <Alert className="mb-8">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Relatórios semanais são enviados à PSP, Câmara do Porto e Juntas de Freguesia. 
          Último relatório: {lastReportDate.toLocaleDateString('pt-PT')} ({daysSinceLastReport} dias atrás) com {lastReportIncidents} incidentes.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <Select onValueChange={setSelectedFreguesia}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Freguesia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {freguesias.map((freguesia) => (
                  <SelectItem key={freguesia} value={freguesia}>{freguesia}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button asChild>
            <Link to="/submit">Reportar Incidente</Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>A carregar incidentes...</span>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredIncidents.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum incidente encontrado com os filtros selecionados.
          </div>
        ) : (
          <IncidentList incidents={filteredIncidents} />
        )}
      </div>
    </>
  )
}

// Incident Details Page Component
function IncidentDetailsPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      try {
        const data = await getApprovedIncidents();
        const foundIncident = data.find(inc => inc.id === id);
        if (foundIncident) {
          setIncident(foundIncident);
        } else {
          setError('Incidente não encontrado');
        }
      } catch (err) {
        setError('Falha ao carregar o incidente. Por favor, tente novamente mais tarde.');
        console.error('Error fetching incident:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>A carregar incidente...</span>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Incidente não encontrado'}</AlertDescription>
        </Alert>
        <Button asChild>
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{incident.location}</h1>
        <Badge variant="outline" className={severityColors[incident.severity]}>
          {severityLabels[incident.severity]}
        </Badge>
      </div>
      
      <div className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Detalhes do Incidente</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Data:</div>
            <div>{new Date(incident.date).toLocaleDateString('pt-PT')}</div>
            <div className="text-muted-foreground">Hora:</div>
            <div>{incident.time}</div>
            <div className="text-muted-foreground">Freguesia:</div>
            <div>{incident.freguesia}</div>
            <div className="text-muted-foreground">Tipo:</div>
            <div>{incident.type}</div>
            <div className="text-muted-foreground">Reportado por:</div>
            <div>{incident.reporterName}</div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Descrição</h2>
          <p className="text-sm">{incident.description}</p>
        </div>
        
        <Button asChild>
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="rua-segura-theme">
      <div className="min-h-screen flex flex-col relative">
        <Header />
        <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 md:py-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/submit" element={<SubmitIncidentPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/incident/:id" element={<IncidentDetailsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

// About Page Component
function AboutPage() {
  return (
    <div className="prose prose-lg dark:prose-invert mx-auto">
      <h1>Sobre a Rua Segura</h1>
      <p>
        A Rua Segura é uma iniciativa cidadã criada para ajudar os residentes do Porto a reportar incidentes de segurança na cidade.
        O nosso objetivo é criar uma comunidade mais segura através da partilha de informações e da colaboração com as autoridades locais.
      </p>
      
      <h2>A Nossa Missão</h2>
      <p>
        Acreditamos que a segurança é uma responsabilidade partilhada. A nossa missão é:
      </p>
      <ul>
        <li>Facilitar a comunicação de incidentes de segurança</li>
        <li>Criar consciência sobre áreas problemáticas na cidade</li>
        <li>Colaborar com as autoridades para melhorar a segurança pública</li>
        <li>Capacitar os cidadãos a tomar medidas proativas para a sua segurança</li>
      </ul>
      
      <h2>Como Funciona</h2>
      <p>
        A plataforma Rua Segura permite que os residentes do Porto reportem incidentes de segurança que testemunharam ou experienciaram.
        Estes relatórios são verificados e compilados em relatórios semanais que são enviados à PSP, Câmara Municipal do Porto e Juntas de Freguesia.
      </p>
      
      <h2>A Nossa Equipa</h2>
      <p>
        Somos um grupo de residentes do Porto preocupados com a segurança da nossa cidade. A nossa equipa inclui profissionais de diversas áreas,
        unidos pelo objetivo comum de tornar o Porto um lugar mais seguro para viver, trabalhar e visitar.
      </p>
      
      <h2>Contacte-nos</h2>
      <p>
        Se tiver dúvidas, sugestões ou quiser juntar-se à nossa iniciativa, não hesite em <a href="/contact">contactar-nos</a>.
      </p>
    </div>
  )
}

// FAQ Page Component
function FAQPage() {
  return (
    <div className="prose prose-lg dark:prose-invert mx-auto">
      <h1>Perguntas Frequentes</h1>
      
      <h2>O que é a Rua Segura?</h2>
      <p>
        A Rua Segura é uma plataforma comunitária que permite aos residentes do Porto reportar e acompanhar incidentes de segurança na cidade.
        O nosso objetivo é promover a segurança pública através da partilha de informações e da colaboração com as autoridades locais.
      </p>
      
      <h2>Como posso reportar um incidente?</h2>
      <p>
        Pode reportar um incidente através do nosso canal de WhatsApp. Basta clicar no botão "Reportar Incidente por WhatsApp" na página inicial
        e seguir as instruções. Pedimos informações básicas como localização, data, hora e uma breve descrição do incidente.
      </p>
      
      <h2>Que tipos de incidentes posso reportar?</h2>
      <p>
        Pode reportar vários tipos de incidentes relacionados com a segurança pública, incluindo:
      </p>
      <ul>
        <li>Furtos e roubos</li>
        <li>Vandalismo</li>
        <li>Atividades suspeitas</li>
        <li>Agressões</li>
        <li>Problemas com iluminação pública</li>
        <li>Outros problemas de segurança pública</li>
      </ul>
      
      <h2>O que acontece com os relatórios de incidentes?</h2>
      <p>
        Os relatórios são verificados pela nossa equipa e compilados em relatórios semanais que são enviados à PSP, Câmara Municipal do Porto
        e Juntas de Freguesia. Estes relatórios ajudam as autoridades a identificar padrões e áreas problemáticas que necessitam de atenção.
      </p>
      
      <h2>Os meus dados pessoais estão seguros?</h2>
      <p>
        Sim, levamos a privacidade muito a sério. Não partilhamos os seus dados pessoais com terceiros sem o seu consentimento.
        Para mais informações, consulte a nossa <a href="/privacy">Política de Privacidade</a>.
      </p>
      
      <h2>Como posso ajudar além de reportar incidentes?</h2>
      <p>
        Pode ajudar divulgando a plataforma Rua Segura entre amigos, familiares e vizinhos. Também pode <a href="/contact">contactar-nos</a>
        se estiver interessado em voluntariar-se ou colaborar connosco de outras formas.
      </p>
    </div>
  )
}

// Contact Page Component
function ContactPage() {
  return (
    <div className="prose prose-lg dark:prose-invert mx-auto">
      <h1>Contacte-nos</h1>
      <p>
        Agradecemos o seu interesse na Rua Segura. Se tiver dúvidas, sugestões ou quiser colaborar connosco,
        utilize um dos métodos de contacto abaixo:
      </p>
      
      <h2>Email</h2>
      <p>
        <a href="mailto:info@ruasegura.pt">info@ruasegura.pt</a>
      </p>
      
      <h2>Redes Sociais</h2>
      <p>
        Siga-nos no Instagram: <a href="https://instagram.com/safestreetporto" target="_blank" rel="noreferrer">@safestreetporto</a>
      </p>
      
      <h2>WhatsApp</h2>
      <p>
        Para reportar incidentes ou entrar em contacto connosco via WhatsApp: +351 912 345 678
      </p>
      
      <h2>Formulário de Contacto</h2>
      <p>
        Prefere enviar-nos uma mensagem diretamente? Utilize o formulário abaixo e responderemos o mais brevemente possível.
      </p>
      
      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium">
            Assunto
          </label>
          <input
            type="text"
            id="subject"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Mensagem
          </label>
          <textarea
            id="message"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Enviar Mensagem
          </button>
        </div>
      </div>
    </div>
  )
}

export default App