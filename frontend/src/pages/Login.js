import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../API";
import M from "materialize-css";

const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [done, setDone] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setDone(false);

    const loginResponse = await apiLogin(user, pass);
    if (loginResponse.status === 200) {
      dispatch({
        type: "SET_SESSION",
        session: Object.assign(await loginResponse.json(), {
          username: user,
        }),
      });
      navigate("/");
    } else {
      setDone(true);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="full-height flex flex-display flex-col">
      <div className="flex" />
      <div>
        <form className="login-form" onSubmit={onSubmit.bind(this)}>
          <div className="row">
            <div className="col s6 offset-s3">
              <input
                data-testid="login-username"
                type="text"
                name="username"
                placeholder="username"
                className="white-text"
                value={user}
                onInput={(e) => setUser(e.target.value)}
              />
            </div>
            <div className="col offset-s3 s6">
              <input
                data-testid="login-password"
                type="password"
                name="password"
                placeholder="********"
                className="white-text"
                value={pass}
                onInput={(e) => setPass(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              data-testid="login-submit"
              className="btn waves-effect waves-light red lighten-1"
              type="submit"
              disabled={!done}
            >
              {done ? "Login" : "Logging In..."}
            </button>
          </div>
        </form>
        {error && <div className="error">{`Error: ${error}`}</div>}
      </div>
      <div className="flex" />
    </div>
  );
};

export default Login;
