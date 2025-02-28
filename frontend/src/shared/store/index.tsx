import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dropdownReducer from "./dropdown-slice";
import responseReducer from "./response-slice";
import userReducer from "./user_slice";
import postReducer from "./post-slice";
import modalReducer from "./modal-slice";

const userPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["userData"],
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
