'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Simulate form submission
    try {
      // In a real app, you would send the form data to a server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Contacte-nos</h1>
      
      <p className="text-muted-foreground mb-8">
        Tem alguma dúvida, sugestão ou feedback? Estamos aqui para ajudar.
        Preencha o formulário abaixo ou utilize um dos nossos canais de contacto direto.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Envie-nos uma mensagem</h2>
          
          {success && (
            <Alert className="mb-6 bg-green-500/10">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="mb-6 bg-red-500/10">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                placeholder="Assunto da mensagem"
                required
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Escreva sua mensagem aqui"
                required
                className="min-h-[120px]"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Mensagem'
              )}
            </Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Informações de Contacto</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">contacto@ruasegura.pt</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Respondemos a todos os emails dentro de 24-48 horas em dias úteis.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Telefone</h3>
                <p className="text-muted-foreground">+351 222 123 456</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Disponível de segunda a sexta, das 9h às 18h.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Endereço</h3>
                <p className="text-muted-foreground">
                  Rua da Segurança, 123<br />
                  4000-123 Porto<br />
                  Portugal
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Visitas apenas com marcação prévia.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Emergências</h3>
            <p className="text-sm text-muted-foreground">
              Para situações de emergência, contacte diretamente as autoridades:<br />
              <strong>112</strong> (Número Europeu de Emergência)<br />
              <strong>222 092 000</strong> (PSP Porto)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 