import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import undefinedFieldReducer from "./undefined-fields-slice";
import dropdownReducer from "./dropdown-slice";
import responseReducer from "./response-slice";
import authReducer from "./auth-slice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isNavAuthClicked", "userData"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    undefinedFields: undefinedFieldReducer,
    dropdown: dropdownReducer,
    response: responseReducer,
    auth: persistedAuthReducer,
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
