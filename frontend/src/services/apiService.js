import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin APIs
export const adminAPI = {
  getAllNGOs: () => api.get('/admin/ngos'),
  getVerifiedNGOs: () => api.get('/admin/ngos/verified'),
  verifyNGO: (ngoAddress) => api.post('/admin/ngos/verify', { ngoAddress }),
  getAllDonations: () => api.get('/admin/donations'),
};

// NGO APIs
export const ngoAPI = {
  register: (data) => api.post('/ngo/register', data),
  getProfile: (walletAddress) => api.get(`/ngo/${walletAddress}`),
  getDonations: (walletAddress) => api.get(`/ngo/${walletAddress}/donations`),
};

// Donor APIs
export const donorAPI = {
  recordDonation: (data) => api.post('/donor/donate', data),
  getDonations: (walletAddress) => api.get(`/donor/${walletAddress}/donations`),
};

export default api;
