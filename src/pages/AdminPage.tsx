import { useState, useEffect } from 'react';
import { getAdminIncidents, updateIncidentStatus } from '@/lib/api';
import { Incident, severityLabels } from '@/types';
import { useAuth } from '@/lib/auth.tsx';
import { Navigate } from 'react-router-dom';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, XCircle, Loader2, LogOut } from 'lucide-react';

const severityColors: Record<string, string> = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const statusColors: Record<string, string> = {
  pending: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  approved: "bg-green-500/10 text-green-700 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function AdminPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  
  // If not authenticated and not loading, redirect to unauthorized page
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchIncidents();
    }
  }, [isAuthenticated]);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminIncidents();
      setIncidents(data);
    } catch (err) {
      setError('Falha ao carregar incidentes. Verifique suas credenciais de administrador.');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      await updateIncidentStatus(id, status);
      // Update local state
      setIncidents(incidents.map(incident => 
        incident.id === id ? { ...incident, status } : incident
      ));
    } catch (err) {
      let actionText = 'atualizar';
      if (status === 'approved') actionText = 'aprovar';
      else if (status === 'rejected') actionText = 'rejeitar';
      else if (status === 'pending') actionText = 'marcar como pendente';
      
      setError(`Falha ao ${actionText} o incidente.`);
      console.error('Error updating incident status:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const filteredIncidents = activeTab === 'all' 
    ? incidents 
    : incidents.filter(incident => incident.status === activeTab);

  if (authLoading || loading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>A carregar incidentes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Administração de Incidentes</h1>
            <p className="text-muted-foreground">
              Revise e aprove ou rejeite os incidentes reportados pelos utilizadores.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              Todos ({incidents.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendentes ({incidents.filter(i => i.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Aprovados ({incidents.filter(i => i.status === 'approved').length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejeitados ({incidents.filter(i => i.status === 'rejected').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum incidente encontrado nesta categoria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIncidents.map((incident) => (
                  <Card key={incident.id}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <CardTitle className="text-lg font-medium">
                          {incident.location}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={severityColors[incident.severity]}>
                            {severityLabels[incident.severity]}
                          </Badge>
                          <Badge variant="outline" className={statusColors[incident.status]}>
                            {incident.status === 'pending' ? 'Pendente' : 
                             incident.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">
                          {new Date(incident.date).toLocaleDateString('pt-PT')} às {incident.time}
                        </div>
                        <div className="text-sm">{incident.description}</div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>Reportado por {incident.reporterName}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{incident.freguesia}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Tipo: {incident.type}</span>
                        </div>
                      </div>
                    </CardContent>
                    {incident.status === 'pending' && (
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(incident.id, 'rejected')}
                          disabled={processingId === incident.id}
                        >
                          {processingId === incident.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Rejeitar
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUpdateStatus(incident.id, 'approved')}
                          disabled={processingId === incident.id}
                        >
                          {processingId === incident.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Aprovar
                        </Button>
                      </CardFooter>
                    )}
                    {incident.status === 'approved' && (
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(incident.id, 'pending')}
                          disabled={processingId === incident.id}
                        >
                          {processingId === incident.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <AlertCircle className="h-4 w-4 mr-2" />
                          )}
                          Marcar como Pendente
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUpdateStatus(incident.id, 'rejected')}
                          disabled={processingId === incident.id}
                        >
                          {processingId === incident.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Rejeitar
                        </Button>
                      </CardFooter>
                    )}
                    {incident.status === 'rejected' && (
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(incident.id, 'pending')}
                          disabled={processingId === incident.id}
                        >
                          {processingId === incident.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <AlertCircle className="h-4 w-4 mr-2" />
                          )}
                          Marcar como Pendente
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUpdateStatus(incident.id, 'approved')}
                          disabled={processingId === incident.id}
                        >
                          {processingId === incident.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Aprovar
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 