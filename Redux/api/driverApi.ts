import { baseApi } from "./baseApi";

export const driverApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDriverProfile: builder.query({
            query: () => "users/me",
            providesTags: ["user"],
        }),
        updateDriverProfile: builder.mutation({
            query: (data) => ({
                url: "users/me",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),
        updateLocation: builder.mutation({
            query: (data) => ({
                url: "users/me/location",
                method: "PATCH",
                body: data,
            }),
        }),
        getActiveRides: builder.query({
            query: () => "orders?status=InProgress",
            providesTags: ["orders"],
        }),
        completeRide: builder.mutation({
            query: (orderId) => ({
                url: `orders/${orderId}/status`,
                method: "PATCH",
                body: { status: "Completed" },
            }),
            invalidatesTags: ["orders"],
        }),
        getDailyStats: builder.query({
            query: () => "dashboard/rider",
            providesTags: ["orders"],
        }),
        getNotifications: builder.query({
            query: () => "notifications",
            providesTags: ["notifications"],
        }),
        markNotificationAsRead: builder.mutation({
            query: (id) => ({
                url: `notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["notifications"],
        }),
        getRiderEarnings: builder.query({
            query: () => "dashboard/rider/earnings",
            providesTags: ["earnings"],
        }),
    }),
});

export const {
    useGetDriverProfileQuery,
    useUpdateDriverProfileMutation,
    useUpdateLocationMutation,
    useGetActiveRidesQuery,
    useCompleteRideMutation,
    useGetDailyStatsQuery,
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useGetRiderEarningsQuery,
} = driverApi;
