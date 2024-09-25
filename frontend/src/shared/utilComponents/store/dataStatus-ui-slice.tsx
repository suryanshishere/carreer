import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const MAX_ARRAY_SIZE = 5;

const dataStatusUISlice = createSlice({
  name: "response",
  initialState: {
    error: [] as string[],              // Error is now an array of strings
    resMsg: [] as string[],             // resMsg is now an array of strings
    permanentResMsg: [] as string[],    // permanentResMsg is now an array of strings
    isLoading: false,
  },
  reducers: {
    setErrorHandler(state, action: PayloadAction<string | null>) {
      // Add new error and limit array size to MAX_ARRAY_SIZE
      if (state.error.length >= MAX_ARRAY_SIZE) {
        state.error.shift(); // Remove the oldest error
      }

      if(action.payload !== null){
        state.error.push(action.payload); // Add the new error
      }
    },

    setResMsg(state, action: PayloadAction<string|null>) {
      // Add new response message and limit array size to MAX_ARRAY_SIZE
      if (state.resMsg.length >= MAX_ARRAY_SIZE) {
        state.resMsg.shift(); // Remove the oldest message
      }
      if(action.payload !== null){
        state.resMsg.push(action.payload); // Add the new response message
      }
    },

    setPermanentResMsg(state, action: PayloadAction<string|null>) {
      // Add new permanent response message and limit array size to MAX_ARRAY_SIZE
      if (state.permanentResMsg.length >= MAX_ARRAY_SIZE) {
        state.permanentResMsg.shift(); // Remove the oldest message
      }
      if(action.payload !== null){
        state.permanentResMsg.push(action.payload); // Add the new permanent message
      }
    },

    isLoadingHandler(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    clearResponse(state) {
      // Clear only the resMsg and error arrays (not permanentResMsg)
      state.resMsg = [];
      state.error = [];
    },
  },
});

export const dataStatusUIAction = dataStatusUISlice.actions;

export default dataStatusUISlice;
