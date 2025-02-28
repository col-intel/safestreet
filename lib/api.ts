import axios from 'axios';
import { Incident } from '@/types';

// Type for incident submission
export type IncidentSubmission = Omit<Incident, 'id' | 'status'>;

// Get all approved incidents for public display
export const getApprovedIncidents = async (): Promise<Incident[]> => {
  try {
    const response = await fetch('/api/incidents?status=approved');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching approved incidents:', error);
    throw error;
  }
};

// Fetch incidents by status (for admin page)
export const fetchIncidents = async (status: 'pending' | 'approved' | 'rejected'): Promise<Incident[]> => {
  try {
    const response = await fetch(`/api/incidents?status=${status}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${status} incidents:`, error);
    throw error;
  }
};

// Submit a new incident
export const submitIncident = async (incident: IncidentSubmission): Promise<{ id: string; message: string }> => {
  try {
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
  } catch (error) {
    console.error('Error submitting incident:', error);
    throw error;
  }
};

// Admin functions
// Get all incidents for admin (requires authentication)
export const getAdminIncidents = async (): Promise<Incident[]> => {
  try {
    const response = await fetch('/api/admin/incidents', {
      headers: {
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'safestreet'}`)}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin incidents:', error);
    throw error;
  }
};

// Update incident status (approve/reject)
export const updateIncidentStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ message: string }> => {
  try {
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
  } catch (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }
};

// Get a single incident by ID
export const getIncidentById = async (id: string): Promise<Incident> => {
  try {
    const response = await fetch(`/api/incidents/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching incident:', error);
    throw error;
  }
}; 