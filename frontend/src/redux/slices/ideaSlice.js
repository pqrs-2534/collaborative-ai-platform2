import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';

const initialState = {
  ideas: [],
  currentIdea: null,
  loading: false,
  generating: false,
  error: null,
};

// Generate ideas
export const generateIdeas = createAsyncThunk(
  'ideas/generate',
  async (data, thunkAPI) => {
    try {
      const response = await aiService.generateIdeas(data);
      toast.success('Idea generated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get ideas
export const getIdeas = createAsyncThunk(
  'ideas/getAll',
  async (params, thunkAPI) => {
    try {
      return await aiService.getIdeas(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Vote on idea
export const voteIdea = createAsyncThunk(
  'ideas/vote',
  async ({ id, vote }, thunkAPI) => {
    try {
      return await aiService.voteIdea(id, vote);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update idea
export const updateIdea = createAsyncThunk(
  'ideas/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await aiService.updateIdea(id, data);
      toast.success('Idea updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const ideaSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearCurrentIdea: (state) => {
      state.currentIdea = null;
    },
    setCurrentIdea: (state, action) => {
      state.currentIdea = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateIdeas.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateIdeas.fulfilled, (state, action) => {
        state.generating = false;
        state.ideas.unshift(action.payload);
      })
      .addCase(generateIdeas.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      })
      .addCase(getIdeas.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = action.payload.data;
      })
      .addCase(getIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(voteIdea.fulfilled, (state, action) => {
        const index = state.ideas.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.ideas[index] = action.payload;
        }
      })
      .addCase(updateIdea.fulfilled, (state, action) => {
        const index = state.ideas.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.ideas[index] = action.payload;
        }
      });
  },
});

export const { clearCurrentIdea, setCurrentIdea } = ideaSlice.actions;
export default ideaSlice.reducer;