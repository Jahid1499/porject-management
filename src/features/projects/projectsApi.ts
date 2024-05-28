
import { apiSlice } from "../api/apiSlice";
export const projectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => `/projects`,
            providesTags: ["projects"],
        }),

        updateProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `/projects/${id}`,
                method: "PATCH",
                body: data,
            })
        }),

        changeStatus: builder.mutation({
            query: ({ id, data }) => ({
                url: `/projects/${id}`,
                method: "PATCH",
                body: data,
            })
        }),

        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["projects"],
        }),

        addProject: builder.mutation({
            query: (data) => ({
                url: "/projects",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["projects"],
        }),
    })
})

export const { useGetProjectsQuery, useAddProjectMutation, useUpdateProjectMutation, useChangeStatusMutation, useDeleteProjectMutation } = projectsApi;