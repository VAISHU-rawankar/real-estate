import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/user/profile', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    getShortlist: builder.query({
      query: () => '/user/shortlist',
      providesTags: ['Shortlist'],
    }),
    addToShortlist: builder.mutation({
      query: (propertyId) => ({ url: `/user/shortlist/${propertyId}`, method: 'POST' }),
      invalidatesTags: ['Shortlist'],
    }),
    removeFromShortlist: builder.mutation({
      query: (propertyId) => ({ url: `/user/shortlist/${propertyId}`, method: 'DELETE' }),
      invalidatesTags: ['Shortlist'],
    }),
    getMyEnquiries: builder.query({
      query: () => '/user/enquiries',
      providesTags: ['Lead'],
    }),
    getAlerts: builder.query({
      query: () => '/user/alerts',
      providesTags: ['Alert'],
    }),
    createAlert: builder.mutation({
      query: (body) => ({ url: '/user/alerts', method: 'POST', body }),
      invalidatesTags: ['Alert'],
    }),
    deleteAlert: builder.mutation({
      query: (id) => ({ url: `/user/alerts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Alert'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetShortlistQuery,
  useAddToShortlistMutation,
  useRemoveFromShortlistMutation,
  useGetMyEnquiriesQuery,
  useGetAlertsQuery,
  useCreateAlertMutation,
  useDeleteAlertMutation,
} = userApi;
