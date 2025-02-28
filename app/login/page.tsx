'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate authentication
    try {
      // In a real app, you would send the credentials to a server for authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple hardcoded check for demo purposes
      if (formData.username === 'admin' && formData.password === 'safestreet') {
        // Set authentication flag in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        
        // Dispatch custom event to notify other components (like the header)
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect to admin page
        router.push('/admin');
      } else {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login Administrativo</h1>
          <p className="text-muted-foreground mt-2">
            Acesse a área administrativa para gerenciar incidentes
          </p>
        </div>
        
        {error && (
          <Alert className="bg-red-500/10">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="admin"
                className="pl-10"
                required
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Esta área é restrita a administradores do sistema.<br />
            Se você é um usuário regular, volte para a <a href="/" className="text-primary hover:underline">página inicial</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 