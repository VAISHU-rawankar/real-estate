import { createSlice } from '@reduxjs/toolkit';

const SESSION_KEY = 'rp_session';

function loadFromSession() {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

const saved = loadFromSession();

const initialState = {
  user: saved?.user || null,
  accessToken: saved?.accessToken || null,
  isAuthenticated: !!(saved?.user && saved?.accessToken),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, accessToken }));
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      const saved = loadFromSession();
      if (saved) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...saved, user: state.user }));
      }
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem(SESSION_KEY);
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsPartner = (state) => state.auth.user?.role === 'channelPartner';

export default authSlice.reducer;
