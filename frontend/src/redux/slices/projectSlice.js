import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';
import toast from 'react-hot-toast';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
};

// Get all projects
export const getProjects = createAsyncThunk(
  'projects/getAll',
  async (params, thunkAPI) => {
    try {
      return await projectService.getProjects(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single project
export const getProject = createAsyncThunk(
  'projects/getOne',
  async (id, thunkAPI) => {
    try {
      return await projectService.getProject(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, thunkAPI) => {
    try {
      const response = await projectService.createProject(projectData);
      toast.success('Project created successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await projectService.updateProject(id, data);
      toast.success('Project updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, thunkAPI) => {
    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add member to project
export const addMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, userId, role }, thunkAPI) => {
    try {
      const response = await projectService.addMember(projectId, userId, role);
      toast.success('Member added successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Projects
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
        state.total = action.payload.pagination?.totalItems || action.payload.data.length;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Single Project
      .addCase(getProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Member
      .addCase(addMember.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      });
  },
});

export const { clearCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;