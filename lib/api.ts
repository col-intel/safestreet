import axios from 'axios';
import { Incident } from '@/types';

// Type for incident submission
export type IncidentSubmission = Omit<Incident, 'id' | 'status'>;

// Get all approved incidents for public display
export const getApprovedIncidents = async (): Promise<Incident[]> => {
  const response = await fetch('/api/incidents?status=approved');
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
};

// Fetch incidents by status (for admin page)
export const fetchIncidents = async (status: 'pending' | 'approved' | 'rejected'): Promise<Incident[]> => {
  const response = await fetch(`/api/incidents?status=${status}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
};

// Submit a new incident
export const submitIncident = async (incident: IncidentSubmission): Promise<{ id: string; message: string }> => {
  const response = await fetch('/api/incidents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(incident),
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
};

// Admin functions
// Get all incidents for admin (requires authentication)
export const getAdminIncidents = async (): Promise<Incident[]> => {
  const response = await fetch('/api/admin/incidents', {
    headers: {
      'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'safestreet'}`)}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
};

// Update incident status (approve/reject)
export const updateIncidentStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ message: string }> => {
  const response = await fetch(`/api/admin/incidents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'safestreet'}`)}`,
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
};

// Get incident by ID
export const getIncidentById = async (id: string): Promise<Incident> => {
  const response = await fetch(`/api/incidents/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
};

// Create a new incident
export async function createIncident(incidentData: Omit<Incident, 'id'>): Promise<Incident> {
  const response = await fetch('/api/incidents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(incidentData),
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  const result = await response.json();
  
  // Fetch the created incident to return the full object
  return await getIncidentById(result.id);
}

// Search incidents
export const searchIncidents = async (query: string): Promise<Incident[]> => {
  const response = await fetch(`/api/incidents/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
};

// Filter incidents by freguesia
export const filterByFreguesia = async (freguesia: string): Promise<Incident[]> => {
  const response = await fetch(`/api/incidents/filter?freguesia=${encodeURIComponent(freguesia)}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
};

// Filter incidents by type
export const filterByType = async (type: string): Promise<Incident[]> => {
  const response = await fetch(`/api/incidents/filter?type=${encodeURIComponent(type)}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
};

// Get incident statistics
export const getIncidentStats = async (): Promise<any> => {
  const response = await fetch('/api/incidents/stats');
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();
}; 