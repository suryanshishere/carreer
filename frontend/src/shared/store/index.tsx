import { configureStore } from "@reduxjs/toolkit";
import undefinedFieldReducer from "./undefined-fields-slice";
import dropdownReducer from "./dropdown-slice";
import responseReducer from "./response-slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import authReducer from "./auth-slice";

const persistConfig = {
  key: "auth",
  storage,
};

// const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    undefinedFields: undefinedFieldReducer,
    dropdown: dropdownReducer,
    response: responseReducer,
    // auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
