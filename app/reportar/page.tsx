'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { submitIncident } from '@/lib/api';
import { Freguesia, Severity, severityLabels } from '@/types';
import { useRouter } from 'next/navigation';

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

// Incident types
const incidentTypes = [
  "Roubo",
  "Furto",
  "Agressão",
  "Vandalismo",
  "Drogas",
  "Comportamento Suspeito",
  "Outro"
];

export default function ReportPage() {
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    freguesia: '',
    description: '',
    type: '',
    severity: '' as Severity,
    reporterName: '',
    email: '',
    subscribeToUpdates: false,
    formattedDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Function to format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value; // This is in YYYY-MM-DD format from the input
    
    // Store the original date format for the input field
    setFormData(prev => ({
      ...prev,
      date: inputDate,
      // Format the date for submission in DD/MM/YYYY format
      formattedDate: formatDate(inputDate)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use the formatted date for submission
      const response = await submitIncident({
        ...formData,
        date: formData.formattedDate || formData.date, // Use formatted date if available
      });

      if (response.id) {
        setSuccess('Incidente reportado com sucesso!');
        // Redirect to success page
        router.push(`/reportar/sucesso?id=${response.id}`);
      } else {
        setError('Ocorreu um erro ao submeter o incidente. Por favor, tente novamente.');
      }

      // Reset form
      setFormData({
        date: '',
        location: '',
        freguesia: '',
        description: '',
        type: '',
        severity: '' as Severity,
        reporterName: '',
        email: '',
        subscribeToUpdates: false,
        formattedDate: ''
      });
    } catch (err) {
      setError('Ocorreu um erro ao submeter o incidente. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Reportar Incidente</h1>
      
      <p className="text-muted-foreground mb-8">
        Preencha o formulário abaixo para reportar um incidente de segurança no Porto.
        Todos os incidentes são revisados pela nossa equipe antes de serem publicados.
      </p>
      
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date">Data do Incidente</Label>
          <Input
            id="date"
            type="date"
            required
            value={formData.date}
            onChange={handleDateChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Formato: DD/MM/AAAA
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            placeholder="Ex: Rua de Santa Catarina, 123"
            required
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="freguesia">Freguesia</Label>
          <Select
            value={formData.freguesia}
            onValueChange={(value) => handleChange('freguesia', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a freguesia" />
            </SelectTrigger>
            <SelectContent>
              {freguesias.map((freguesia) => (
                <SelectItem key={freguesia} value={freguesia}>
                  {freguesia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Incidente</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de incidente" />
            </SelectTrigger>
            <SelectContent>
              {incidentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="severity">Severidade</Label>
          <Select
            value={formData.severity}
            onValueChange={(value) => handleChange('severity', value as Severity)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a severidade" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(severityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Descreva o incidente em detalhes"
            required
            className="min-h-[120px]"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reporterName">Seu Nome</Label>
          <Input
            id="reporterName"
            placeholder="Nome completo"
            required
            value={formData.reporterName}
            onChange={(e) => handleChange('reporterName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email (opcional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Todas as informações são encriptadas. Utilizaremos o seu email apenas para enviar atualizações sobre o progresso do incidente.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="subscribeToUpdates"
            checked={formData.subscribeToUpdates}
            onCheckedChange={(checked) => handleChange('subscribeToUpdates', checked)}
          />
          <Label htmlFor="subscribeToUpdates" className="text-sm">
            Desejo receber atualizações sobre este incidente
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Reportar Incidente'
          )}
        </Button>
      </form>
    </div>
  );
} 