import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../API";

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
    <div>
      <form className="login-form" onSubmit={onSubmit.bind(this)}>
        <div>
          <input
            data-testid="login-username"
            type="text"
            name="username"
            placeholder="username"
            value={user}
            onInput={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <input
            data-testid="login-password"
            type="password"
            name="password"
            placeholder="********"
            value={pass}
            onInput={(e) => setPass(e.target.value)}
          />
        </div>
        <div>
          <button data-testid="login-submit" type="submit" disabled={!done}>
            {done ? "Login" : "Logging In..."}
          </button>
        </div>
      </form>
      {error && <div className="error">{`Error: ${error}`}</div>}
    </div>
  );
};

export default Login;
