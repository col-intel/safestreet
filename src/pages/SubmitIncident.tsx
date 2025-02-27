import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { submitIncident, IncidentSubmission } from '@/lib/api';
import { Freguesia, Severity, severityLabels } from '@/types';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Sample data for freguesias and incident types
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

const incidentTypes = [
  "Furto",
  "Roubo",
  "Vandalismo",
  "Agressão",
  "Atividade Suspeita",
  "Outro"
];

// Form validation schema
const formSchema = z.object({
  date: z.string().min(1, { message: "A data é obrigatória" }),
  time: z.string().min(1, { message: "A hora é obrigatória" }),
  location: z.string().min(3, { message: "A localização deve ter pelo menos 3 caracteres" }),
  freguesia: z.string().min(1, { message: "A freguesia é obrigatória" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  type: z.string().min(1, { message: "O tipo de incidente é obrigatório" }),
  severity: z.enum(["low", "medium", "high"], { 
    required_error: "A severidade é obrigatória" 
  }),
  reporterName: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
});

type FormData = z.infer<typeof formSchema>;

export function SubmitIncidentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      severity: 'medium',
    }
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const incidentData: IncidentSubmission = {
        ...data,
      };
      
      await submitIncident(incidentData);
      setSubmitSuccess(true);
      
      // Reset form or redirect after successful submission
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setSubmitError('Ocorreu um erro ao submeter o incidente. Por favor, tente novamente.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitSuccess) {
    return (
      <div className="container max-w-2xl py-10">
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle>Incidente Reportado com Sucesso</AlertTitle>
          <AlertDescription>
            Obrigado por contribuir para a segurança da nossa cidade. O seu reporte será analisado em breve.
            Será redirecionado para a página inicial em alguns segundos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Reportar Incidente</CardTitle>
          <CardDescription>
            Preencha o formulário abaixo para reportar um incidente de segurança no Porto.
            Todos os incidentes são revistos antes de serem publicados.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data do Incidente</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Hora do Incidente</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                />
                {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                placeholder="Ex: Rua de Santa Catarina, próximo ao nº 100"
                {...register('location')}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="freguesia">Freguesia</Label>
              <Select 
                onValueChange={(value) => setValue('freguesia', value)}
                defaultValue=""
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
              {errors.freguesia && <p className="text-sm text-red-500">{errors.freguesia.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Incidente</Label>
              <Select 
                onValueChange={(value) => setValue('type', value)}
                defaultValue=""
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
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Severidade</Label>
              <RadioGroup 
                defaultValue="medium"
                onValueChange={(value) => setValue('severity', value as Severity)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="severity-low" />
                  <Label htmlFor="severity-low">{severityLabels.low}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="severity-medium" />
                  <Label htmlFor="severity-medium">{severityLabels.medium}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="severity-high" />
                  <Label htmlFor="severity-high">{severityLabels.high}</Label>
                </div>
              </RadioGroup>
              {errors.severity && <p className="text-sm text-red-500">{errors.severity.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Incidente</Label>
              <Textarea
                id="description"
                placeholder="Descreva o que aconteceu com o máximo de detalhes possível"
                rows={4}
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reporterName">Seu Nome</Label>
              <Input
                id="reporterName"
                placeholder="Seu nome (será exibido no reporte)"
                {...register('reporterName')}
              />
              {errors.reporterName && <p className="text-sm text-red-500">{errors.reporterName.message}</p>}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'A submeter...' : 'Submeter Incidente'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 