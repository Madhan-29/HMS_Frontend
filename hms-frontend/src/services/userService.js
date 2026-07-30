import api from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  
  updateUserStatus: async (id, enabled) => {
    const response = await api.put(`/api/users/${id}/status`, { enabled });
    return response.data;
  },
  
  updateUserRole: async (id, roleName) => {
    const response = await api.put(`/api/users/${id}/role`, { roleName });
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }
};
