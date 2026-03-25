import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const rechargeService = {
  detectOperator: (mobileNumber) => api.post('/recharge/detect-operator', { mobileNumber }),
  createOrder: (amount) => api.post('/recharge/create-order', { amount }),
  verifyPayment: (paymentData) => api.post('/recharge/verify-payment', paymentData)
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getTransactions: (status) => api.get(`/admin/transactions${status ? `?status=${status}` : ''}`),
  updateSettings: (settings) => api.post('/admin/settings', settings),
  createCashbackRule: (rule) => api.post('/admin/cashback-rules', rule),
  createPopupOffer: (offer) => api.post('/admin/popup-offers', offer)
};

export const walletService = {
  getWalletDetails: (userId) => api.get(`/wallet/${userId}`),
  addCashback: (cashbackData) => api.post('/wallet/add-cashback', cashbackData)
};

export default api;
