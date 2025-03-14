import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dropdownReducer from "./dropdownSlice";
import responseReducer from "./responseSlice";
import userReducer, { initialUserSliceState } from "./userSlice";
import postReducer from "./postSlice";
import modalReducer from "./modalSlice";

const saveSubsetOfMode = createTransform(
  // Inbound: persist only the `max` property.
  (inboundState: any, key) => {
    return { max: inboundState.max };
  },
  // Outbound: rehydrate by merging persisted `max` with default tag values.
  (outboundState: any, key) => {
    return {
      max: outboundState.max,
      tags: { ...initialUserSliceState.mode["tags"] },
    };
  },
  { whitelist: ["mode"] }
);

export const userPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["userData", "mode"],
  transforms: [saveSubsetOfMode],
};
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
  reducer: {
    dropdown: dropdownReducer,
    response: responseReducer,
    user: persistedUserReducer,
    post: postReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable to handle non-serializable values like functions
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
