import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getLeadChartData: builder.query({
      query: (days = 30) => `/admin/dashboard/chart/leads?days=${days}`,
    }),
    getRecentActivity: builder.query({
      query: () => '/admin/dashboard/recent-activity',
    }),
    getAdminLeads: builder.query({
      query: (params) => ({ url: '/admin/leads', params }),
      providesTags: ['Lead'],
    }),
    getLeadById: builder.query({
      query: (id) => `/admin/leads/${id}`,
      providesTags: (r, e, id) => [{ type: 'Lead', id }],
    }),
    updateLeadStatus: builder.mutation({
      query: ({ id, status, note }) => ({ url: `/admin/leads/${id}/status`, method: 'PATCH', body: { status, note } }),
      invalidatesTags: ['Lead', 'Dashboard'],
    }),
    addLeadNote: builder.mutation({
      query: ({ id, text }) => ({ url: `/admin/leads/${id}/notes`, method: 'PATCH', body: { text } }),
      invalidatesTags: (r, e, { id }) => [{ type: 'Lead', id }],
    }),
    getLeadAnalytics: builder.query({
      query: (params) => ({ url: '/admin/leads/analytics', params }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetLeadChartDataQuery,
  useGetRecentActivityQuery,
  useGetAdminLeadsQuery,
  useGetLeadByIdQuery,
  useUpdateLeadStatusMutation,
  useAddLeadNoteMutation,
  useGetLeadAnalyticsQuery,
} = adminApi;
