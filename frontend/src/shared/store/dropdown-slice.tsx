import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DropdownState {
  showNavDropdown: boolean;
}

const initialState: DropdownState = {
  showNavDropdown: false,
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    handleShowNavDropdown(state, action: PayloadAction<boolean>) {
      state.showNavDropdown = action.payload;
    },
  },
});

export const { handleShowNavDropdown } = dropdownSlice.actions;
export default dropdownSlice.reducer;