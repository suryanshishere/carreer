import { configureStore } from "@reduxjs/toolkit";
import responseUISlice from "./reponse-ui-slice";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: { response: responseUISlice.reducer },
});

export default store;
