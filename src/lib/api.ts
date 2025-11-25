const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, ip_address: '' }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  register: async (email: string, password: string, full_name: string, phone_number?: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name, phone_number }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
};

export const vehiclesApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/vehicles`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
};

export const parkingSlotsApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/parking-slots`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch slots');
    return response.json();
  },

  getAvailable: async (type?: string) => {
    const url = type ? `${API_URL}/parking-slots/available?type=${type}` : `${API_URL}/parking-slots/available`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch available slots');
    return response.json();
  },
};

export const parkingSessionsApi = {
  getActive: async () => {
    const response = await fetch(`${API_URL}/parking-sessions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  start: async (vehicle_id: number, slot_id: number) => {
    const response = await fetch(`${API_URL}/parking-sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ vehicle_id, slot_id }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  exit: async (sessionId: number) => {
    const response = await fetch(`${API_URL}/parking-sessions/${sessionId}/exit`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to exit session');
    return response.json();
  },
};

export const statsApi = {
  get: async () => {
    const response = await fetch(`${API_URL}/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};
