import api from './api';

export const visitorService = {
  createVisitorRequest: async (visitorData) => {
    const response = await api.post('/api/visitors', visitorData);
    return response.data;
  },
  
  getAllVisitors: async () => {
    const response = await api.get('/api/visitors');
    return response.data;
  },
  
  getMyVisitors: async () => {
    const response = await api.get('/api/visitors/my');
    return response.data;
  },
  
  updateVisitorStatus: async (id, status) => {
    const response = await api.put(`/api/visitors/${id}/status`, { status });
    return response.data;
  }
};
