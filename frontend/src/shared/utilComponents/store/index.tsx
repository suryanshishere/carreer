import { configureStore } from "@reduxjs/toolkit";
import dataStatusUISlice from "./data-status-ui";
import undefinedFieldSlice from "./undefined-fields";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    dataStatus: dataStatusUISlice.reducer,
    undefinedFields: undefinedFieldSlice.reducer,
  },
});

export default store;
