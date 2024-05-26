
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    search: "",
};

const filtersSlice = createSlice({
    name: "project/filter",
    initialState,
    reducers: {
        tagSelected: (state, action) => {
            state?.tags?.push(action.payload);
        },
        searched: (state, action) => {
            state.search = action.payload;
        },
    },
});

export default filtersSlice.reducer;
export const { searched } = filtersSlice.actions;
