import { baseApi } from './baseApi';

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCmsContent: builder.query({
      query: (page) => ({
        url: '/cms',
        params: page ? { page } : undefined,
      }),
      providesTags: ['Cms'],
    }),
    getSectionContent: builder.query({
      query: ({ page, section }) => `/cms/${page}/${section}`,
      providesTags: (result, error, arg) => [{ type: 'Cms', id: `${arg.page}-${arg.section}` }],
    }),
    updateSectionContent: builder.mutation({
      query: ({ page, section, data }) => ({
        url: `/admin/cms/${page}/${section}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        'Cms',
        { type: 'Cms', id: `${arg.page}-${arg.section}` }
      ],
    }),
  }),
});

export const {
  useGetCmsContentQuery,
  useGetSectionContentQuery,
  useUpdateSectionContentMutation,
} = cmsApi;
