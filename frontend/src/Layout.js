import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthWidget from "./AuthWidget";
import { apiInterval } from "./API";
import config from "./config.json";

const Layout = ({ children }) => {
  const session = useSelector((state) => state.session);
  const title = useSelector((state) => state.title);
  const dispatch = useDispatch();

  let titleDisplay = config.appTitle;
  if (title !== config.appTitle) {
    titleDisplay += " - " + title;
  }

  useEffect(() => {
    if (session) {
      return apiInterval(session, dispatch);
    }
  });

  return (
    <div className="page">
      <Helmet>
        <title>{titleDisplay}</title>
      </Helmet>

      <div className="sidebar">
        <Link to="/">
          <div className="centered">
            <img src={"/favicon.ico"} className="app-logo" alt="logo" />
          </div>
        </Link>
      </div>
      <div className="content">
        <div>
          <div className="banner flex-display flex-col">
            <div className="flex"></div>
            <h3 className="banner-text" data-testid="page-title">
              {title}
            </h3>
            <div className="flex"></div>
          </div>
        </div>
        <div>{children}</div>
      </div>
      <div className="sidebar">
        <AuthWidget />
      </div>
    </div>
  );
};

export default Layout;
