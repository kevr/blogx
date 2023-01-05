import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AuthWidget = () => {
  const session = useSelector((state) => state.session);

  const content = !session ? (
    <Link to="/login/">Login</Link>
  ) : (
    <span>{session.username}</span>
  );

  return <div className="auth-widget">{content}</div>;
};

export default AuthWidget;
