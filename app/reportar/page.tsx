'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { createIncident } from '@/lib/api';
import { Severity, Incident } from '@/types';

const formSchema = z.object({
  location: z.string().min(5, {
    message: 'A localização deve ter pelo menos 5 caracteres.',
  }),
  freguesia: z.string().min(1, {
    message: 'Por favor selecione uma freguesia.',
  }),
  type: z.string().min(1, {
    message: 'Por favor selecione um tipo de incidente.',
  }),
  date: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'Por favor insira uma data válida no formato DD/MM/AAAA.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }).max(500, {
    message: 'A descrição não pode ter mais de 500 caracteres.',
  }),
  severity: z.enum(['low', 'medium', 'high'] as const),
  reporterName: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  reporterEmail: z.string().email({
    message: 'Por favor insira um email válido.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const incidentTypes = [
  'Iluminação pública deficiente',
  'Vandalismo em propriedade pública',
  'Graffiti não autorizado',
  'Lixo acumulado',
  'Mobiliário urbano danificado',
  'Vegetação obstruindo passagem',
  'Espaço público inseguro',
  'Agressão',
  'Roubo/Furto',
  'Tráfico de drogas',
  'Consumo de drogas em público',
  'Comportamento suspeito',
  'Outro',
];

const freguesias = [
  'Alvalade',
  'Areeiro',
  'Arroios',
  'Avenidas Novas',
  'Beato',
  'Belém',
  'Benfica',
  'Campo de Ourique',
  'Campolide',
  'Carnide',
  'Estrela',
  'Lumiar',
  'Marvila',
  'Misericórdia',
  'Olivais',
  'Parque das Nações',
  'Penha de França',
  'Santa Clara',
  'Santa Maria Maior',
  'Santo António',
  'São Domingos de Benfica',
  'São Vicente',
];

// Helper function to format date as dd/mm/yyyy
function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper function to parse dd/mm/yyyy to Date object with improved validation
function parseDDMMYYYY(dateString: string): Date {
  try {
    // Check if the string matches the expected format
    if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(dateString)) {
      console.error('Date string does not match expected format DD/MM/YYYY:', dateString);
      return new Date(); // Return current date as fallback
    }
    
    // Extract components and convert to numbers
    const [dayStr, monthStr, yearStr] = dateString.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    
    // Basic validation
    if (isNaN(day) || isNaN(month) || isNaN(year) || 
        day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
      console.error('Invalid date components:', { day, month, year });
      return new Date(); // Return current date as fallback
    }
    
    // Create date at noon UTC to avoid timezone issues
    // Using noon (12:00:00) helps avoid date shifting due to timezone conversions
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    
    // Verify the date is valid (handles cases like Feb 31)
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      console.error('Date validation failed:', { 
        input: { day, month, year }, 
        output: { 
          year: date.getUTCFullYear(), 
          month: date.getUTCMonth() + 1, 
          day: date.getUTCDate() 
        } 
      });
      return new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 12, 0, 0)); // Return current date at noon UTC as fallback
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing date:', error);
    // Return current date at noon UTC as fallback
    return new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 12, 0, 0));
  }
}

export default function ReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      freguesia: '',
      type: '',
      date: formatDateToDDMMYYYY(new Date()),
      description: '',
      severity: 'medium',
      reporterName: '',
      reporterEmail: '',
    },
  });
  
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Parse the date from dd/mm/yyyy format to Date object
      const dateObj = parseDDMMYYYY(values.date);
      
      // Format as ISO string with timezone handling
      const isoDate = dateObj.toISOString();
      
      // Log detailed information for debugging
      console.log('Parsed date:', { 
        input: values.date, 
        dateObj: dateObj.toString(), 
        isoDate,
        mockFormat: '2023-05-15T10:30:00Z', // Example from mock data
        utcComponents: {
          year: dateObj.getUTCFullYear(),
          month: dateObj.getUTCMonth() + 1,
          day: dateObj.getUTCDate(),
          hours: dateObj.getUTCHours(),
          minutes: dateObj.getUTCMinutes()
        }
      });
      
      // Create an object that matches the Incident type structure
      const incidentData: Omit<Incident, 'id'> = {
        date: isoDate,
        status: 'pending',
        location: values.location,
        freguesia: values.freguesia,
        type: values.type,
        description: values.description,
        severity: values.severity,
        reporterName: values.reporterName,
        email: values.reporterEmail,
      };
      
      console.log('Submitting incident data:', incidentData);
      
      try {
        const result = await createIncident(incidentData);
        console.log('Incident created successfully:', result);
        
        setSubmitStatus('success');
        
        // Reset form after successful submission
        form.reset();
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (apiError) {
        console.error('API error creating incident:', apiError);
        setSubmitStatus('error');
        setErrorMessage(`Erro ao criar incidente: ${apiError instanceof Error ? apiError.message : 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setSubmitStatus('error');
      setErrorMessage('Ocorreu um erro ao submeter o formulário. Por favor tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reportar Incidente</h1>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo para reportar um problema de segurança urbana.
        </p>
      </div>
      
      {submitStatus === 'success' ? (
        <Card className="border-green-500/20 bg-green-500/5 border-dashed">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">Incidente reportado com sucesso!</h3>
                <p className="text-sm text-muted-foreground">
                  Obrigado por contribuir para a segurança da sua comunidade. Será redirecionado para a página inicial em breve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : submitStatus === 'error' ? (
        <Card className="border-destructive/20 bg-destructive/5 border-dashed mb-6">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">Erro</h3>
                <p className="text-sm text-muted-foreground">
                  {errorMessage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Detalhes do Incidente</CardTitle>
          <CardDescription>
            Forneça informações detalhadas sobre o problema de segurança que encontrou.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Rua das Flores, 123" className="border-dashed" {...field} />
                      </FormControl>
                      <FormDescription>
                        Indique o endereço ou local específico do incidente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="freguesia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Freguesia</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-dashed">
                              <SelectValue placeholder="Selecione a freguesia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-dashed">
                            {freguesias.map((freguesia) => (
                              <SelectItem key={freguesia} value={freguesia}>
                                {freguesia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Incidente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-dashed">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-dashed">
                            {incidentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Incidente</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="DD/MM/AAAA"
                          className="border-dashed" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Indique quando o incidente ocorreu (formato: DD/MM/AAAA).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gravidade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-dashed">
                            <SelectValue placeholder="Selecione a gravidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-dashed">
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Indique o nível de urgência ou perigo que este problema representa.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o problema em detalhes..." 
                          className="min-h-32 border-dashed" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Forneça detalhes adicionais que possam ajudar a entender e resolver o problema.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="border-dashed" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Informações de Contacto</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="reporterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input className="border-dashed" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reporterEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" className="border-dashed" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4 p-3 bg-muted/40 rounded-md border border-dashed border-border">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      O seu email nunca será mostrado publicamente e será utilizado apenas para validar o seu relatório. 
                      O seu nome será anonimizado (ex: Tiago M. em vez de Tiago Mendes) para proteger a sua privacidade.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="border-dashed">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      A submeter...
                    </>
                  ) : (
                    'Submeter Relatório'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 