'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchIncidents, updateIncidentStatus } from '@/lib/api';
import { Incident } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
      
      if (!authStatus) {
        router.push('/login');
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const handleAuthChange = () => checkAuth();
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [router]);

  // Fetch incidents based on active tab
  useEffect(() => {
    // Only fetch if authenticated
    if (!isAuthenticated) return;
    
    const loadIncidents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchIncidents(activeTab as 'pending' | 'approved' | 'rejected');
        setIncidents(data);
      } catch (err) {
        console.error('Failed to fetch incidents:', err);
        setError('Failed to load incidents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, [activeTab, actionSuccess, isAuthenticated]);

  const handleStatusChange = async (incidentId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setActionLoading(incidentId);
    setActionSuccess(null);
    setError(null);
    
    try {
      await updateIncidentStatus(incidentId, newStatus);
      setActionSuccess(`Incident status updated to ${newStatus}`);
      
      // Remove the incident from the current list if the status changed to something else
      if (newStatus !== activeTab) {
        setIncidents(incidents.filter(incident => incident.id !== incidentId));
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to update incident status:', err);
      setError('Failed to update incident status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">Manage incident reports by approving or rejecting them.</p>
      
      {actionSuccess && (
        <Alert className="mb-6 bg-green-500/10">
          <AlertDescription>{actionSuccess}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="mb-6 bg-red-500/10">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected
          </TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No {activeTab} incidents found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {incidents.map((incident) => (
              <Card key={incident.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{incident.type}</CardTitle>
                    {getStatusBadge(incident.status)}
                  </div>
                  <CardDescription>
                    <div className="text-sm text-muted-foreground">
                      {new Date(incident.date).toLocaleDateString()}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="font-medium mb-1">{incident.location}</p>
                  <p className="text-sm text-muted-foreground mb-2">Freguesia: {incident.freguesia}</p>
                  <p className="text-sm line-clamp-3">{incident.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-2 pt-2">
                  <div className="text-xs text-muted-foreground mb-2">
                    Reported by: {incident.reporterName}
                    {incident.email && (
                      <div className="mt-1">Email: {incident.email}</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {activeTab !== 'approved' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                        onClick={() => handleStatusChange(incident.id, 'approved')}
                        disabled={actionLoading === incident.id}
                      >
                        {actionLoading === incident.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </Button>
                    )}
                    
                    {activeTab !== 'rejected' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                        onClick={() => handleStatusChange(incident.id, 'rejected')}
                        disabled={actionLoading === incident.id}
                      >
                        {actionLoading === incident.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </Button>
                    )}
                    
                    {activeTab !== 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-yellow-500/20"
                        onClick={() => handleStatusChange(incident.id, 'pending')}
                        disabled={actionLoading === incident.id}
                      >
                        {actionLoading === incident.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Clock className="h-4 w-4 mr-2" />
                        )}
                        Mark as Pending
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
} 