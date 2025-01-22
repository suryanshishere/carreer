import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dropdownReducer from "./dropdown-slice";
import responseReducer from "./response-slice";
import authReducer from "./auth-slice";
import postReducer from "./post-slice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["userData"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    dropdown: dropdownReducer,
    response: responseReducer,
    auth: persistedAuthReducer,
    post: postReducer,
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
