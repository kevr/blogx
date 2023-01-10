export const sessionReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_SESSION":
      localStorage.setItem("session", JSON.stringify(action.session));
      return action.session;
    default:
      return state;
  }
};
