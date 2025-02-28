import axios from 'axios';
import { Incident } from '@/types';

// Determine the API URL based on the environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.origin) || 
  'http://localhost:3000';

// Type for incident submission
export type IncidentSubmission = Omit<Incident, 'id' | 'status' | 'createdAt'>;

// Get all approved incidents for public display
export const getApprovedIncidents = async (): Promise<Incident[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/incidents?status=approved`);
    return response.data;
  } catch (error) {
    console.error('Error fetching approved incidents:', error);
    throw error;
  }
};

// Submit a new incident
export const submitIncident = async (incident: IncidentSubmission): Promise<{ id: string; message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/api/incidents`, incident);
    return response.data;
  } catch (error) {
    console.error('Error submitting incident:', error);
    throw error;
  }
};

// Admin functions
// Get all incidents for admin (requires authentication)
export const getAdminIncidents = async (): Promise<Incident[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/incidents`, {
      auth: {
        username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'safestreet'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin incidents:', error);
    throw error;
  }
};

// Update incident status (approve/reject)
export const updateIncidentStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ message: string }> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/admin/incidents/${id}`,
      { status },
      {
        auth: {
          username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
          password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'safestreet'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }
}; 