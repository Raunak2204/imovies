import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    adminSidebarOpen: true,
    theme: 'dark',
    notifications: [],
    globalLoading: false,
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    toggleAdminSidebar(state) {
      state.adminSidebarOpen = !state.adminSidebarOpen;
    },
    setAdminSidebarOpen(state, action) {
      state.adminSidebarOpen = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    addNotification(state, action) {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleAdminSidebar,
  setAdminSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
