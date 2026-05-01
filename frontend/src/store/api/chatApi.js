import { baseApi } from './baseApi';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/chat',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendMessageMutation } = chatApi;
