import api from './api';

const chatService = {
  // Get messages for a project
  getMessages: async (projectId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/chat/${projectId}/messages?${queryString}`);
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (projectId, messageIds) => {
    const response = await api.post(`/chat/${projectId}/read`, { messageIds });
    return response;
  },
};

export default chatService;