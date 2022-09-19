import "./online.css";
import * as api from '../../api/index.js';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Online({userId}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});

  
  useEffect(() => {
    let isRequestCancelled = false;    

    const getUser = async () => {
      try {
        const { data } = await api.getUser({userId: userId});
        if (!isRequestCancelled) {
          setUser(data);
        }
      } catch (error) {
        console.log("Error in getting online users : ", error);
      }
    }
    getUser();
    return () => {
      isRequestCancelled = true;
  };
  }, [userId]);


  return (
    <li className="rightbarFriend">
      <Link to={`/profile/${user?._id}`} className="profileBox">
        <div className="rightbarProfileImgContainer">
          <img className="rightbarProfileImg"
            src={
              user?.profilePicture
              ? PF + user.profilePicture
              : PF + "person/noAvatar.png"
            } alt="profile pic" />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{user?.username}</span>
      </Link>
    </li>
  );
}
