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
      action: PayloadAction<{ id: string; bool?: boolean }>
    ) {
      const { id, bool } = action.payload;
      state.dropdownStates[id] = bool ?? !state.dropdownStates[id];
    },
    closeSpecificDropdowns(state, action: PayloadAction<string[]>) {
      action.payload.forEach((id) => {
        if (state.dropdownStates[id]) {
          state.dropdownStates[id] = false;
        }
      });
    },
    closeAllDropdowns(state) {
      state.dropdownStates = {};
    },
  },
});

export const { toggleDropdownState,  closeSpecificDropdowns,closeAllDropdowns } = dropdownSlice.actions;
export default dropdownSlice.reducer;
