import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DropdownState {
  dropdownStates: Record<string, boolean>;
}

const initialState: DropdownState = {
  dropdownStates: {},
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    toggleDropdownState(state, action: PayloadAction<string>) {
      const itemId = action.payload;
      state.dropdownStates[itemId] = !state.dropdownStates[itemId];
    },
    closeAllDropdowns(state) {
      state.dropdownStates = {};
    },
  },
});

export const { toggleDropdownState, closeAllDropdowns } = dropdownSlice.actions;
export default dropdownSlice.reducer;
