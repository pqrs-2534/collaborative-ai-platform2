import api from './api';

const commentService = {
  // Get comments for a target
  getComments: async (targetType, targetId) => {
    const response = await api.get(`/comments?targetType=${targetType}&targetId=${targetId}`);
    return response.data;
  },

  // Create comment
  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (id, content) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response;
  },

  // Add reaction
  addReaction: async (id, emoji) => {
    const response = await api.post(`/comments/${id}/reactions`, { emoji });
    return response.data;
  },
};

export default commentService;