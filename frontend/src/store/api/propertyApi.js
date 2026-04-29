import { baseApi } from './baseApi';

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params) => ({ url: '/properties', params }),
      providesTags: ['Property'],
    }),
    getFeaturedProperties: builder.query({
      query: (limit = 8) => `/properties/featured?limit=${limit}`,
      providesTags: ['Property'],
    }),
    getPropertyBySlug: builder.query({
      query: (slug) => `/properties/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Property', id: slug }],
    }),
    getRelatedProperties: builder.query({
      query: (slug) => `/properties/${slug}/related`,
    }),
    getPropertySuggestions: builder.query({
      query: (keyword) => `/properties/suggestions?keyword=${keyword}`,
    }),

    // Admin endpoints
    getAdminProperties: builder.query({
      query: (params) => ({ url: '/admin/properties', params }),
      providesTags: ['Property'],
    }),
    createProperty: builder.mutation({
      query: (body) => ({ url: '/admin/properties', method: 'POST', body }),
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/properties/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Property'],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({ url: `/admin/properties/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Property'],
    }),
    updatePropertyStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/admin/properties/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Property'],
    }),
    toggleFeatured: builder.mutation({
      query: (id) => ({ url: `/admin/properties/${id}/featured`, method: 'PATCH' }),
      invalidatesTags: ['Property'],
    }),
    uploadPropertyImages: builder.mutation({
      query: ({ id, formData }) => ({ url: `/admin/properties/${id}/images`, method: 'POST', body: formData }),
      invalidatesTags: ['Property'],
    }),
    deletePropertyImage: builder.mutation({
      query: ({ propertyId, imageId }) => ({ url: `/admin/properties/${propertyId}/images/${imageId}`, method: 'DELETE' }),
      invalidatesTags: ['Property'],
    }),
    reorderImages: builder.mutation({
      query: ({ propertyId, orderedIds }) => ({ url: `/admin/properties/${propertyId}/images/reorder`, method: 'PATCH', body: { orderedIds } }),
      invalidatesTags: ['Property'],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetFeaturedPropertiesQuery,
  useGetPropertyBySlugQuery,
  useGetRelatedPropertiesQuery,
  useGetPropertySuggestionsQuery,
  useGetAdminPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useUpdatePropertyStatusMutation,
  useToggleFeaturedMutation,
  useUploadPropertyImagesMutation,
  useDeletePropertyImageMutation,
  useReorderImagesMutation,
} = propertyApi;
