import { Link } from "react-router-dom";
import AuthWidget from "./AuthWidget";
import logo from "./logo.svg";

const Layout = ({ children }) => {
  return (
    <div className="page">
      <div className="sidebar">
        <Link to="/">
          <div className="centered">
            <img src={logo} className="app-logo" alt="logo" />
          </div>
        </Link>
      </div>
      <div className="content">{children}</div>
      <div className="sidebar">
        <AuthWidget />
      </div>
    </div>
  );
};

export default Layout;
