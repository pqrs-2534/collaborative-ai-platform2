import api from './api';

const documentService = {
  // Get all documents
  getDocuments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/documents?${queryString}`);
    return response;
  },

  // Get single document
  getDocument: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  // Create document
  createDocument: async (documentData) => {
    const response = await api.post('/documents', documentData);
    return response.data;
  },

  // Update document
  updateDocument: async (id, documentData) => {
    const response = await api.put(`/documents/${id}`, documentData);
    return response.data;
  },

  // Get version history
  getVersionHistory: async (id) => {
    const response = await api.get(`/documents/${id}/versions`);
    return response.data;
  },

  // Restore version
  restoreVersion: async (documentId, versionId) => {
    const response = await api.post(
      `/documents/${documentId}/versions/${versionId}/restore`
    );
    return response.data;
  },
};

export default documentService;