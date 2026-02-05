import api from './api';

const taskService = {
  // Get all tasks
  getTasks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/tasks?${queryString}`);
    return response;
  },

  // Get single task
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response;
  },

  // Bulk update tasks (for drag & drop)
  bulkUpdateTasks: async (tasks) => {
    const response = await api.put('/tasks/bulk-update', { tasks });
    return response;
  },
};

export default taskService;