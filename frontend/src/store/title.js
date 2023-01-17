import config from "../config.json";

const defaultState = {
  page: config.appTitle,
  author: undefined,
};

export const titleReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "DEFAULT_TITLE":
      return Object.assign({}, state, {
        page: config.appTitle,
        author: undefined,
      });
    case "SET_TITLE":
      return Object.assign({}, state, {
        page: action.title,
        author: action.author,
      });
    default:
      return state;
  }
};
