import { configureStore } from "@reduxjs/toolkit";
import undefinedFieldSlice from "./undefined-fields";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    undefinedFields: undefinedFieldSlice.reducer,
  },
});

export default store;
