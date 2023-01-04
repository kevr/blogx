import { useSelector } from "react-redux";
import logo from "./logo.svg";

const Entry = () => {
  const session = useSelector((state) => state.session);

  return (
    <div className="app">
      <img src={logo} className="app-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="app-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </div>
  );
};

export default Entry;
