import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import "github-markdown-css";
import { apiRequest } from "../API";
import { APIError } from "../Error";
import Loader from "../Loader";
import "../Markdown.css";

const Post = () => {
  const { id } = useParams();
  const apiLock = useRef(false);

  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (apiLock.current) return;
    apiLock.current = true;

    apiRequest(session, dispatch, `/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: "SET_TITLE",
          title: data.title,
          author: data.author,
        });
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
    return <APIError />;
  }

  const isOwner = session && session.username === post.author.username;

  return (
    <div>
      <div className="post-author text-small">
        {isOwner && (
          <Link
            className="red lighten-1 btn abs-right"
            data-testid="edit-button"
            to={`/posts/${id}/edit`}
          >
            {"Edit Post"}
          </Link>
        )}
      </div>
      <article className="markdown-body" data-testid="post-content">
        <Markdown children={post.content} />
      </article>
    </div>
  );
};

export default Post;
