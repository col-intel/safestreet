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
    time: '',
    location: '',
    freguesia: '',
    description: '',
    type: '',
    severity: '' as Severity,
    reporterName: '',
    email: '',
    subscribeToUpdates: false
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await submitIncident(formData);
      setSuccess(result.message);
      // Reset form
      setFormData({
        date: '',
        time: '',
        location: '',
        freguesia: '',
        description: '',
        type: '',
        severity: '' as Severity,
        reporterName: '',
        email: '',
        subscribeToUpdates: false
      });
    } catch (err) {
      setError('Ocorreu um erro ao submeter o incidente. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data do Incidente</Label>
            <Input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Hora do Incidente</Label>
            <Input
              id="time"
              type="time"
              required
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
            />
          </div>
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