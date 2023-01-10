import { configureStore } from "@reduxjs/toolkit";
import { sessionReducer } from "./session";

export const createStore = () => {
  return configureStore({
    reducer: {
      session: sessionReducer,
    },
  });
};
