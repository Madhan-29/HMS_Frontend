import api from './api';

export const noticeService = {
  createNotice: async (noticeData) => {
    const response = await api.post('/api/notices', noticeData);
    return response.data;
  },
  
  getAllNotices: async () => {
    const response = await api.get('/api/notices');
    return response.data;
  },
  
  deleteNotice: async (id) => {
    const response = await api.delete(`/api/notices/${id}`);
    return response.data;
  }
};
