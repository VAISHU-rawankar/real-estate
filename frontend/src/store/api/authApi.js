import { baseApi } from './baseApi';
import { setCredentials, logout } from '../slices/authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));
      },
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (!data.data.require2FA) {
            dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));
          }
        } catch {}
      },
    }),
    verifyAdmin2FA: builder.mutation({
      query: (body) => ({ url: '/auth/verify-admin-2fa', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));
      },
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({ url: '/auth/refresh-token', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ accessToken: data.data.accessToken }));
      },
    }),
    sendOTP: builder.mutation({
      query: (body) => ({ url: '/auth/send-otp', method: 'POST', body }),
    }),
    verifyOTP: builder.mutation({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', body }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyAdmin2FAMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
