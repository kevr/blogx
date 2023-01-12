import config from "../config.json";

export const titleReducer = (state = config.appTitle, action) => {
  switch (action.type) {
    case "DEFAULT_TITLE":
      return config.appTitle;
    case "SET_TITLE":
      return action.title;
    default:
      return state;
  }
};
