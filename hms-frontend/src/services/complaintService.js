import api from './api';

export const complaintService = {
  createComplaint: async (complaintData) => {
    const response = await api.post('/api/complaints', complaintData);
    return response.data;
  },
  
  getAllComplaints: async () => {
    const response = await api.get('/api/complaints');
    return response.data;
  },
  
  getMyComplaints: async () => {
    const response = await api.get('/api/complaints/my');
    return response.data;
  },
  
  updateComplaintStatus: async (id, status) => {
    const response = await api.put(`/api/complaints/${id}/status`, { status });
    return response.data;
  }
};
