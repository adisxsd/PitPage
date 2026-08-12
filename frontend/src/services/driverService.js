import api from './api';

export const driverService = {
  getAllDrivers: async () => {
    const response = await api.get('/drivers');
    return response.data;
  },
  
  getDriverById: async (id) => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },
  
  createDriver: async (data) => {
    const response = await api.post('/drivers', data);
    return response.data;
  },
  
  updateDriver: async (id, data) => {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  },
  
  deleteDriver: async (id) => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  }
};