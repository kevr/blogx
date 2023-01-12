import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { apiRequest } from "../API";
import Loader from "../Loader";
import config from "../config";

const Home = () => {
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const apiLock = useRef(false);

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (apiLock.current) return;
    apiLock.current = true;

    dispatch({ type: "DEFAULT_TITLE" });

    const getPosts = async () => {
      setLoading(true);
      setError(false);

      const response = await apiRequest(session, dispatch, "titles")
        .then((response) => response.json())
        .then((posts) => {
          console.debug("Loaded posts");
          setPosts(posts);
          setLoading(false);
        })
        .catch(() => {
          console.error("Unable to retrieve posts");
          setError(true);
          setLoading(false);
        });
    };

    getPosts();
  });

  const dateCreated = (post) => {
    // Produce date `post` was created
    const date = new Date(post.created);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const content = loading ? (
    <Loader />
  ) : error ? (
    <div>
      <div>
        <i className="red-text lighten-1 material-icons large">close</i>
      </div>
      <div>
        <div>{"Error: Unable to load data"}</div>
        <div className="text-small">
          Contact webmaster{" "}
          <a href={`mailto:${config.admin.email}`}>{config.admin.email}</a>
        </div>
      </div>
    </div>
  ) : (
    posts.map((post) => (
      <Link key={post.id} to={`/post/${post.id}`}>
        <div className="card card-post grey darken-3" data-testid="post">
          <div className="card-content">
            <span className="card-title text-left white-text">
              <b>{post.title}</b>
              <small className="right grey-text">{dateCreated(post)}</small>
            </span>
            <div className="text-left">
              <small className="grey-text">by {post.author.name}</small>
            </div>
          </div>
        </div>
      </Link>
    ))
  );

  return <div>{content}</div>;
};

export default Home;
