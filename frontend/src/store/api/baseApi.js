import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { selectAccessToken, setCredentials, logout } from '../slices/authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState());
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
  credentials: 'include',
});

/**
 * baseQueryWithReauth — wraps rawBaseQuery to handle 401 responses.
 * On 401: attempt silent token refresh via the httpOnly refresh cookie,
 * update Redux state, then retry the original request once.
 * If refresh also fails, dispatch logout.
 */
async function baseQueryWithReauth(args, api, extraOptions) {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try to refresh the access token using the httpOnly cookie
    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult?.data?.data?.accessToken) {
      const newToken = refreshResult.data.data.accessToken;
      // Preserve existing user from state, only update the token
      const currentUser = api.getState().auth.user;
      api.dispatch(setCredentials({ user: currentUser, accessToken: newToken }));
      // Retry the original query with the new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — log out the user
      api.dispatch(logout());
    }
  }

  return result;
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Property', 'Lead', 'User', 'Blog', 'Partner', 'Shortlist', 'Alert', 'Dashboard'],
  endpoints: () => ({}),
});
