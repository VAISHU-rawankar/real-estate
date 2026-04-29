import { baseApi } from './baseApi';

export const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnquiry: builder.mutation({
      query: (body) => ({ url: '/leads', method: 'POST', body }),
    }),
  }),
});

export const { useCreateEnquiryMutation } = leadApi;
