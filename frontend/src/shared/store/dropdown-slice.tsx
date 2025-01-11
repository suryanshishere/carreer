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
    toggleDropdownState(
      state,
      action: PayloadAction<{ id: string; state?: boolean }>
    ) {
      const { id, state: newState } = action.payload;
      state.dropdownStates[id] = newState ?? !state.dropdownStates[id];
    },
    closeAllDropdowns(state) {
      state.dropdownStates = {};
    },
  },
});

export const { toggleDropdownState, closeAllDropdowns } = dropdownSlice.actions;
export default dropdownSlice.reducer;
