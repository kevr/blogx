import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthWidget from "./AuthWidget";
import logo from "./logo.svg";
import config from "./config.json";

const Layout = ({ children }) => {
  const title = useSelector((state) => state.title);

  let titleDisplay = config.appTitle;
  if (title !== config.appTitle) {
    titleDisplay += " - " + title;
  }

  return (
    <div className="page">
      <Helmet>
        <title>{titleDisplay}</title>
      </Helmet>

      <div className="sidebar">
        <Link to="/">
          <div className="centered">
            <img src={logo} className="app-logo" alt="logo" />
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
