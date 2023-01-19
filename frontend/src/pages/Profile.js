import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { apiRequest, apiInterval } from "../API";
import { APIError } from "../Error";
import Loader from "../Loader";
import Social from "../Social";

const Profile = () => {
  const { id } = useParams();
  const apiLock = useRef(false);
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const [user, setUser] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (apiLock.current) return;
    apiLock.current = true;

    apiRequest(session, dispatch, `users/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setError(false);
        setUser(data);
        dispatch({
          type: "SET_TITLE",
          title: data.name,
        });
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });

    return apiInterval(session, dispatch);
  });

  if (error) {
    return <APIError />;
  }

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="profile">
      <div>
        <img
          className="profile-avatar"
          src={user.profile.avatar}
          alt="Profile avatar"
        />
      </div>
      <div className="information">
        {user.profile.webpage && (
          <a
            className="red lighten-1 btn"
            href={user.profile.webpage}
            target="_blank"
            rel="noreferrer"
          >
            {"View Personal Webpage"}
          </a>
        )}
      </div>
      <div className="text-left">
        <hr />
        <h5>Bio</h5>
        <p className="text-justify">{user.profile.bio}</p>
      </div>
      <div className="socials">
        <hr />
        <h5>Socials</h5>
        {user.profile.socials.map((social, index) => (
          <Social data={social} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
