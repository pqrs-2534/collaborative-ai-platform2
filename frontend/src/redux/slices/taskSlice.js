import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

// Get tasks
export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (params, thunkAPI) => {
    try {
      return await taskService.getTasks(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      const response = await taskService.createTask(taskData);
      toast.success('Task created successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await taskService.updateTask(id, data);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, thunkAPI) => {
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Bulk update tasks (for drag & drop)
export const bulkUpdateTasks = createAsyncThunk(
  'tasks/bulkUpdate',
  async (tasksData, thunkAPI) => {
    try {
      await taskService.bulkUpdateTasks(tasksData);
      return tasksData;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    optimisticUpdateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      })
      .addCase(bulkUpdateTasks.fulfilled, (state, action) => {
        action.payload.forEach(update => {
          const index = state.tasks.findIndex(t => t._id === update.id);
          if (index !== -1) {
            state.tasks[index] = { ...state.tasks[index], ...update };
          }
        });
      });
  },
});

export const { clearCurrentTask, setCurrentTask, optimisticUpdateTask } = taskSlice.actions;
export default taskSlice.reducer;