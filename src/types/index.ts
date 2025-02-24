export type Freguesia = 
  | 'Bonfim'
  | 'Campanhã'
  | 'Cedofeita'
  | 'Lordelo do Ouro'
  | 'Massarelos'
  | 'Paranhos'
  | 'Ramalde'
  | 'Santo Ildefonso'
  | 'São Nicolau'
  | 'Sé'
  | 'Vitória';

export type Severity = 'low' | 'medium' | 'high';

export interface Incident {
  id: string;
  date: string;
  time: string;
  location: string;
  freguesia: Freguesia;
  description: string;
  type: string;
  severity: Severity;
  reporterName: string;
  status: 'pending' | 'approved' | 'rejected';
  photos?: string[];
}

export const severityLabels: Record<Severity, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta'
}