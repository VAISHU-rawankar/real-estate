import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { selectAccessToken } from '../slices/authSlice';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || ''}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const token = selectAccessToken(getState());
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Property', 'Lead', 'User', 'Blog', 'Partner', 'Shortlist', 'Alert', 'Dashboard'],
  endpoints: () => ({}),
});
