import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://instant-mechanic.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard
export const getDashboard = async (period?: string) => {
  const { data } = await api.get(`/dashboard?period=${period || 'today'}`);
  return data.data;
};

// Bookings
export const getBookings = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  mechanicId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.append(key, String(value));
  });
  const { data } = await api.get(`/bookings?${query.toString()}`);
  return data.data;
};

export const getBookingById = async (id: string) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data.data;
};

export const updateBookingStatus = async (id: string, status: string, notes?: string) => {
  const { data } = await api.patch(`/bookings/${id}/status`, { status, notes });
  return data.data;
};

// Mechanics
export const getMechanics = async (params?: { status?: string; search?: string }) => {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);
  const { data } = await api.get(`/mechanics?${query.toString()}`);
  return data.data;
};

export const getMechanicById = async (id: string) => {
  const { data } = await api.get(`/mechanics/${id}`);
  return data.data;
};

export const updateMechanicStatus = async (id: string, status: string, reason?: string) => {
  const { data } = await api.patch(`/mechanics/${id}/status`, { status, reason });
  return data.data;
};