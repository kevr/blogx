import { configureStore } from "@reduxjs/toolkit";
import { sessionReducer } from "./session";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
});
