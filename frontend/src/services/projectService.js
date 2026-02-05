import api from './api';

const projectService = {
  // Get all projects
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/projects?${queryString}`);
    return response;
  },

  // Get single project
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response;
  },

  // Add member to project
  addMember: async (projectId, userId, role) => {
    const response = await api.post(`/projects/${projectId}/members`, {
      userId,
      role,
    });
    return response.data;
  },

  // Remove member from project
  removeMember: async (projectId, memberId) => {
    const response = await api.delete(`/projects/${projectId}/members/${memberId}`);
    return response.data;
  },

  // Archive project
  archiveProject: async (projectId) => {
    const response = await api.put(`/projects/${projectId}/archive`);
    return response.data;
  },
};

export default projectService;