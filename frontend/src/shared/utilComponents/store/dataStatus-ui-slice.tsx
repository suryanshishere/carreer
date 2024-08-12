import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const dataStatusUISlice = createSlice({
  name: "response",
  initialState: {
    error: null,
    resMsg: null,
    permanentResMsg: null,
    isLoading: false,
  },
  reducers: {
    setErrorHandler(state, action) {
      state.error = action.payload;
    },

    setResMsg(state, action) {
      state.resMsg = action.payload;
    },

    setPermanentResMsg(state, action) {
      state.permanentResMsg = action.payload;
    },

    isLoadingHandler(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    clearResponse(state) {
      state.resMsg = null;
      state.error = null;
    },
  },
});

export const dataStatusUIAction = dataStatusUISlice.actions;

export default dataStatusUISlice;
