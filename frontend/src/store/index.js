import { configureStore } from "@reduxjs/toolkit";
import { sessionReducer } from "./session";
import { titleReducer } from "./title";

export const createStore = () => {
  return configureStore({
    reducer: {
      session: sessionReducer,
      title: titleReducer,
    },
  });
};
