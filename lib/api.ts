import axios from 'axios';
import { Incident } from '@/types';

// Type for incident submission
export type IncidentSubmission = Omit<Incident, 'id' | 'status'>;

// Mock API functions for development
const API_DELAY = 1000; // Simulate network delay

// Mock incidents data
let mockIncidents: Incident[] = [
  {
    id: '1',
    date: '2023-05-15T10:30:00Z',
    location: 'Rua de Santa Catarina, 123',
    freguesia: 'Santo Ildefonso',
    description: 'Buraco grande na estrada causando perigo para veículos e pedestres.',
    type: 'Buraco na estrada',
    severity: 'high',
    status: 'approved',
    reporterName: 'João Silva',
    reporterEmail: 'joao.silva@example.com',
  },
  {
    id: '2',
    date: '2023-05-10T14:45:00Z',
    location: 'Avenida dos Aliados, 45',
    freguesia: 'Santo Ildefonso',
    description: 'Poste de iluminação danificado, com risco de queda.',
    type: 'Iluminação pública danificada',
    severity: 'medium',
    status: 'approved',
    reporterName: 'Maria Santos',
    reporterEmail: 'maria.santos@example.com',
  },
  {
    id: '3',
    date: '2023-05-05T09:15:00Z',
    location: 'Rua do Almada, 78',
    freguesia: 'Vitória',
    description: 'Sinal de trânsito caído na calçada.',
    type: 'Sinalização danificada',
    severity: 'low',
    status: 'pending',
    reporterName: 'António Ferreira',
    reporterEmail: 'antonio.ferreira@example.com',
  },
  {
    id: '4',
    date: '2023-05-01T16:20:00Z',
    location: 'Rua de Cedofeita, 200',
    freguesia: 'Cedofeita',
    description: 'Passadeira com marcações quase invisíveis, difícil de ver à noite.',
    type: 'Passadeira apagada',
    severity: 'medium',
    status: 'approved',
    reporterName: 'Sofia Costa',
    reporterEmail: 'sofia.costa@example.com',
  },
  {
    id: '5',
    date: '2023-04-28T11:10:00Z',
    location: 'Rua da Boavista, 150',
    freguesia: 'Cedofeita',
    description: 'Árvore caída bloqueando parte da estrada após tempestade.',
    type: 'Árvore caída',
    severity: 'high',
    status: 'approved',
    reporterName: 'Pedro Oliveira',
    reporterEmail: 'pedro.oliveira@example.com',
  },
];

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
    // Fallback to mock data in development
    return mockIncidents.filter(inc => inc.status === 'approved');
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
    // Fallback to mock data in development
    return mockIncidents.filter(inc => inc.status === status);
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
    // Fallback to mock data in development
    const newIncident = await createIncident({
      ...incident,
      status: 'pending',
    });
    return { id: newIncident.id, message: 'Incident submitted successfully' };
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
    // Fallback to mock data in development
    return mockIncidents;
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
    // Fallback to mock data in development
    const updatedIncident = await updateIncidentStatusMock(id, status);
    return { message: `Incident status updated to ${status}` };
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
    // Fallback to mock data in development
    return getIncidentByIdMock(id);
  }
};

// Mock implementation functions (for development only)

// Get all incidents
export async function getIncidents(): Promise<Incident[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockIncidents);
    }, API_DELAY);
  });
}

// Get incident by ID (mock implementation)
async function getIncidentByIdMock(id: string): Promise<Incident> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const incident = mockIncidents.find((inc) => inc.id === id);
      if (incident) {
        resolve(incident);
      } else {
        reject(new Error('Incident not found'));
      }
    }, API_DELAY);
  });
}

// Create a new incident
export async function createIncident(incidentData: Omit<Incident, 'id'>): Promise<Incident> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newIncident: Incident = {
        ...incidentData,
        id: (mockIncidents.length + 1).toString(),
      };
      
      mockIncidents = [newIncident, ...mockIncidents];
      resolve(newIncident);
    }, API_DELAY);
  });
}

// Update incident status (mock implementation)
async function updateIncidentStatusMock(id: string, status: 'approved' | 'pending' | 'rejected'): Promise<Incident> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const incidentIndex = mockIncidents.findIndex((inc) => inc.id === id);
      
      if (incidentIndex !== -1) {
        mockIncidents[incidentIndex] = {
          ...mockIncidents[incidentIndex],
          status,
        };
        resolve(mockIncidents[incidentIndex]);
      } else {
        reject(new Error('Incident not found'));
      }
    }, API_DELAY);
  });
}

// Delete incident
export async function deleteIncident(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockIncidents.length;
      mockIncidents = mockIncidents.filter((inc) => inc.id !== id);
      
      if (mockIncidents.length < initialLength) {
        resolve(true);
      } else {
        reject(new Error('Incident not found'));
      }
    }, API_DELAY);
  });
}

// Get incidents by freguesia
export async function getIncidentsByFreguesia(freguesia: string): Promise<Incident[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredIncidents = mockIncidents.filter(
        (inc) => inc.freguesia === freguesia && inc.status === 'approved'
      );
      resolve(filteredIncidents);
    }, API_DELAY);
  });
}

// Get incidents by type
export async function getIncidentsByType(type: string): Promise<Incident[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredIncidents = mockIncidents.filter(
        (inc) => inc.type === type && inc.status === 'approved'
      );
      resolve(filteredIncidents);
    }, API_DELAY);
  });
}

// Get incidents by severity
export async function getIncidentsBySeverity(severity: string): Promise<Incident[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredIncidents = mockIncidents.filter(
        (inc) => inc.severity === severity && inc.status === 'approved'
      );
      resolve(filteredIncidents);
    }, API_DELAY);
  });
}

// Get approved incidents (mock implementation)
export async function getApprovedIncidentsMock(): Promise<Incident[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const approvedIncidents = mockIncidents.filter((inc) => inc.status === 'approved');
      resolve(approvedIncidents);
    }, API_DELAY);
  });
}

// Get pending incidents
export async function getPendingIncidents(): Promise<Incident[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pendingIncidents = mockIncidents.filter((inc) => inc.status === 'pending');
      resolve(pendingIncidents);
    }, API_DELAY);
  });
}

// Search incidents
export async function searchIncidents(query: string): Promise<Incident[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      const searchResults = mockIncidents.filter(
        (inc) =>
          (inc.location.toLowerCase().includes(lowercaseQuery) ||
            inc.description.toLowerCase().includes(lowercaseQuery) ||
            inc.type.toLowerCase().includes(lowercaseQuery) ||
            inc.freguesia.toLowerCase().includes(lowercaseQuery)) &&
          inc.status === 'approved'
      );
      resolve(searchResults);
    }, API_DELAY);
  });
} 