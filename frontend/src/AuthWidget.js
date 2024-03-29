import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { apiStatus } from "./API";

const AuthWidget = () => {
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const apiLock = useRef(false);
  const location = useLocation();

  useEffect(() => {
    // Renders can be called more than once, since React expects
    // "pure" functions. Since we're making an API call in this
    // hook, we want to opt-out of calling more than once.
    // useRef(...) is used to achieve this:
    if (apiLock.current) return;
    apiLock.current = true;

    const handleSession = async () => {
      const localSession = localStorage.getItem("session");

      // If a session exists in localStorage, but it's not yet in Redux:
      if (localSession && !session) {
        console.debug("Fetching status...");
        const sessionData = JSON.parse(localSession);

        // Obtain authentication status from the API
        const statusResponse = await apiStatus(sessionData, dispatch);

        // If our localSession access/refresh token is valid
        if (statusResponse.status === 200) {
          console.debug("Session validated");
        } else {
          console.error("Session expired");
        }
      }
    };

    handleSession();
  }, [session, dispatch]);

  const onLogout = (event) => {
    event.preventDefault();

    // Unset the Redux store's session
    dispatch({
      type: "SET_SESSION",
      session: null,
    });
  };

  const pathname = encodeURIComponent(location.pathname);
  const content = !session ? (
    <div className="centered">
      <Link
        to={`/login/?next=${pathname}`}
        className="waves-effect waves-light red lighten-1 btn"
      >
        Login
      </Link>
    </div>
  ) : (
    <div className="centered">
      <div className="row">
        <b>{session.username}</b>
      </div>
      <div className="row">
        <a
          href="/logout/"
          className="waves-effect waves-light red lighten-1 btn"
          onClick={onLogout}
        >
          Logout
        </a>
      </div>
    </div>
  );

  return <div className="auth-widget">{content}</div>;
};

export default AuthWidget;
