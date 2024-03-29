import config from "./config.json";

// API endpoints without prefix
export const STATUS_ENDPOINT = "auth/status";
export const TOKEN_ENDPOINT = "api/token";
export const TOKEN_REFRESH_ENDPOINT = "api/token/refresh";

export const apiEndpoint = (endpoint) => {
  const reLeft = new RegExp("^[/]+");
  const reRight = new RegExp("[/]+$");
  const ep = endpoint.replace(reLeft, "").replace(reRight, "");
  return `${config.apiPrefix}/${ep}/`;
};

export const apiLogin = (username, password) => {
  const endpoint = apiEndpoint(TOKEN_ENDPOINT);
  return fetch(endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
};

export const apiRefresh = (refresh_token) => {
  const endpoint = apiEndpoint(TOKEN_REFRESH_ENDPOINT);
  return fetch(endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refresh_token,
    }),
  });
};

export const apiRequest = async (
  session,
  dispatch,
  endpoint,
  method = "get",
  data = null
) => {
  const endpoint_ = apiEndpoint(endpoint);
  const options = {
    method: method,
    headers: {},
  };

  // If `session` has been set
  if (session) {
    // Use `session.access` API token to make the request
    options.headers["Authorization"] = "Bearer " + session.access;
  }

  // If data was provided
  if (data) {
    // Set the content type to JSON and supply JSON serialized data as a body
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  // Perform the request toward `endpoint`
  let response = await fetch(endpoint_, options);
  if (response.status === 200) {
    // Update Redux session, no matter what
    dispatch({ type: "SET_SESSION", session: session });
    return response;
  }

  // If the access token expired
  let updatedSession = null;
  if (response.status === 401 && session) {
    // Refresh the access token
    const tokenResponse = await apiRefresh(session.refresh);

    // If the refresh request was successful
    if (tokenResponse.status === 200) {
      console.debug("Session refreshed");

      // Update session's access token with the JSON response received
      const tokenData = await tokenResponse.json();
      updatedSession = Object.assign({}, session, tokenData);

      // Try the fetch again with renewed token
      options.headers.Authorization = "Bearer " + tokenData.access;
      response = await fetch(endpoint_, options);
    }

    dispatch({
      type: "SET_SESSION",
      session: updatedSession,
    });
  }

  // If authentication failed, return the original failed response
  return response;
};

export const apiStatus = (session, dispatch) => {
  return apiRequest(session, dispatch, STATUS_ENDPOINT);
};

export const intervalImpl = (session, dispatch) => {
  return apiRefresh(session.refresh)
    .then((response) => response.json())
    .then((data) => {
      dispatch({
        type: "SET_SESSION",
        session: Object.assign({}, session, data),
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

export const apiInterval = (session, dispatch, timeout = 60000) => {
  const interval = setInterval(() => {
    intervalImpl(session, dispatch);
  }, timeout);

  return () => clearInterval(interval);
};
