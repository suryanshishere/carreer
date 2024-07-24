import { configureStore } from "@reduxjs/toolkit";
import dataStatusUISlice from "./dataStatus-ui-slice";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: { dataStatus: dataStatusUISlice.reducer },
});

export default store;
