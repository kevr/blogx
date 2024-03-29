import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ContentState, Editor, EditorState, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import Markdown from "markdown-to-jsx";
import "github-markdown-css";
import { APIError } from "../Error";
import Loader from "../Loader";
import { apiRequest, apiInterval } from "../API";
import "../Markdown.css";

const Edit = () => {
  const { id } = useParams();
  const apiLock = useRef(false);

  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [error, setError] = useState();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (!apiLock.current) {
      apiLock.current = true;

      apiRequest(session, dispatch, `/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          dispatch({ type: "SET_TITLE", title: data.title });
          // Break all repeated \n chars down to a single \n
          const content = ContentState.createFromText(data.content);
          setEditorState(EditorState.createWithContent(content));
          setPost(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError(true);
          setLoading(false);
        });
    }

    if (!session || (post && session.username !== post.author.username)) {
      navigate(`/posts/${id}`);
      return;
    }

    return apiInterval(session, dispatch);
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <APIError />;
  }

  const onChange = (content) => {
    setEditorState(content);
    const blocks = convertToRaw(content.getCurrentContent()).blocks;
    const value = blocks.map((block) => block.text).join("\n");
    setPost(Object.assign({}, post, { content: value }));
  };

  const onSave = () => {
    // 1. Submit PATCH to API
    apiRequest(session, dispatch, `posts/${id}/`, "PATCH", {
      content: post.content,
    }).then((response) => {
      if (response.status === 200) {
        // Navigate back to <Post>
        navigate(`/posts/${id}`);
      } else {
        console.error(response);
      }
    });
  };

  return (
    <div className="full flex flex-display flex-row relative post-editor-container">
      <button
        className="red lighten-1 btn abs-right"
        onClick={onSave}
        data-testid="save-button"
      >
        {"Save Changes"}
      </button>
      <div className="half post-editor" data-testid="post-editor">
        <Editor editorState={editorState} onChange={onChange} />
      </div>
      <div className="half scroll" data-testid="post-preview">
        <article className="markdown-body preview" data-testid="post-content">
          <Markdown children={post.content} />
        </article>
      </div>
    </div>
  );
};

export default Edit;
