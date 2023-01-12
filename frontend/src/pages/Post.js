import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../API";
import Loader from "../Loader";

const Post = () => {
  const { id } = useParams();
  const apiLock = useRef(false);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (apiLock.current) return;
    apiLock.current = true;

    apiRequest(null, null, `/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "SET_TITLE", title: data.title });
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <div>
          <i className="red-text lighten-1 material-icons large">close</i>
        </div>
        <div>Error</div>
      </div>
    );
  }

  return (
    <div>
      <div className="author text-small">
        by <Link to={`/users/${post.author.id}`}>{post.author.name}</Link>
      </div>
      <div>{post.content}</div>
    </div>
  );
};

export default Post;
