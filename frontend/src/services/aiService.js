import api from './api';

const aiService = {
  // Generate ideas using AI
  generateIdeas: async (data) => {
    const response = await api.post('/ai/generate-ideas', data);
    return response.data;
  },

  // Get all ideas
  getIdeas: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/ai/ideas?${queryString}`);
    return response;
  },

  // Update idea
  updateIdea: async (id, data) => {
    const response = await api.put(`/ai/ideas/${id}`, data);
    return response.data;
  },

  // Vote on idea
  voteIdea: async (id, vote) => {
    const response = await api.post(`/ai/ideas/${id}/vote`, { vote });
    return response.data;
  },

  // Refine idea using AI
  refineIdea: async (id, refinementPrompt) => {
    const response = await api.post(`/ai/ideas/${id}/refine`, {
      refinementPrompt,
    });
    return response.data;
  },
};

export default aiService;