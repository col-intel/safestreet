export type Severity = 'low' | 'medium' | 'high';

export const severityLabels: Record<Severity, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export type Incident = {
  id: string;
  date: string;
  location: string;
  freguesia: string;
  description: string;
  type: string;
  severity: Severity;
  status: 'approved' | 'pending' | 'rejected';
  reporterName: string;
  reporterEmail: string;
};

export type Freguesia = string; 