import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  modals: {
    createProject: false,
    createTask: false,
    taskDetail: false,
    ideaGenerator: false,
    userProfile: false,
  },
  activeModal: null,
  modalData: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      const { name, data } = action.payload;
      state.modals[name] = true;
      state.activeModal = name;
      state.modalData = data || null;
    },
    closeModal: (state, action) => {
      const name = action.payload;
      if (name) {
        state.modals[name] = false;
      } else {
        // Close all modals
        Object.keys(state.modals).forEach(key => {
          state.modals[key] = false;
        });
      }
      state.activeModal = null;
      state.modalData = null;
    },
    setModalData: (state, action) => {
      state.modalData = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setModalData,
} = uiSlice.actions;

export default uiSlice.reducer;