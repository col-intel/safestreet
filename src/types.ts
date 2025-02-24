export type Severity = "low" | "medium" | "high"

export type Freguesia = string

export type Incident = {
  id: string
  date: string
  time: string
  location: string
  freguesia: Freguesia
  description: string
  type: string
  severity: Severity
  reporterName: string
  status: "pending" | "approved" | "rejected"
}

export const severityLabels: Record<Severity, string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto"
} 