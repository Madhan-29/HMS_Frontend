import api from './api';

export const leaveService = {
  createLeaveRequest: async (leaveData) => {
    const response = await api.post('/api/leave', leaveData);
    return response.data;
  },
  
  getAllLeaveRequests: async () => {
    const response = await api.get('/api/leave');
    return response.data;
  },
  
  getMyLeaveRequests: async () => {
    const response = await api.get('/api/leave/my');
    return response.data;
  },
  
  updateLeaveStatus: async (id, status) => {
    const response = await api.put(`/api/leave/${id}/status`, { status });
    return response.data;
  }
};
