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
import { Severity } from '@/types';

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
  'Buraco na estrada',
  'Iluminação pública danificada',
  'Sinalização danificada',
  'Passadeira apagada',
  'Obstáculo na via',
  'Árvore caída',
  'Inundação',
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
      await createIncident({
        ...values,
        date: new Date().toISOString(),
        status: 'pending',
      });
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      form.reset();
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage('Ocorreu um erro ao submeter o formulário. Por favor tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reportar Incidente</h1>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo para reportar um problema de segurança viária.
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
            Forneça informações detalhadas sobre o problema que encontrou.
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