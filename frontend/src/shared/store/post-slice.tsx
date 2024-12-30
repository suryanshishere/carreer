import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  isEditPostClicked: boolean;
  isAllKeyValuePairsStored: boolean;
  keyValuePairs: Record<string, any>; // To explicitly track stored key-value pairs
}

const initialState: PostState = {
  isEditPostClicked: false,
  isAllKeyValuePairsStored: false,
  keyValuePairs: {},
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setEditPostClicked(state, action: PayloadAction<boolean>) {
      state.isEditPostClicked = action.payload;
    },
    setKeyValuePair(state, action: PayloadAction<{ key: string; value: any }>) {
      const { key, value } = action.payload;
      state.keyValuePairs[key] = value;

      // Update `isAllKeyValuePairsStored` based on a condition, e.g.,
      // when the number of key-value pairs reaches a certain number.
      // Replace the condition with your own logic if needed.
      state.isAllKeyValuePairsStored =
        Object.keys(state.keyValuePairs).length > 0;
    },
    resetKeyValuePairs(state) {
      state.keyValuePairs = {};
      state.isAllKeyValuePairsStored = false;
      state.isEditPostClicked = false;
    },
    removeKeyValuePair(state, action: PayloadAction<string>) {
      const keyToRemove = action.payload;
      if (state.keyValuePairs[keyToRemove] !== undefined) {
        delete state.keyValuePairs[keyToRemove];
      }

      // Update `isAllKeyValuePairsStored` after removal
      state.isAllKeyValuePairsStored =
        Object.keys(state.keyValuePairs).length > 0;
    },
  },
});

export const {
  setEditPostClicked,
  setKeyValuePair,
  resetKeyValuePairs,
  removeKeyValuePair,
} = postSlice.actions;
export default postSlice.reducer;
