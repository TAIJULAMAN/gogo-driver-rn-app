import { baseApi } from "./baseApi";

export const commonApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCommonContent: builder.query({
            query: () => "common",
            providesTags: ["common"],
        }),
        createReport: builder.mutation({
            query: (data) => ({
                url: "report",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["report"],
        }),
    }),
});

export const { useGetCommonContentQuery, useCreateReportMutation } = commonApi;
