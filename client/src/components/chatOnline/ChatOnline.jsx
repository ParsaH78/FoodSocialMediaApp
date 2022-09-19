import { useEffect, useState } from "react";
import "./chatOnline.css";
import { useSelector, useDispatch } from "react-redux";
import {getFollowings, getMe} from "../../actions/UserActions";
import * as api from '../../api/index.js';
import {createConversation} from "../../actions/ChatActions";


export default function ChatOnline({ onlineUsers, currentId, setCurrentChat, socket }) {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentUser: user, followingsData: friends } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    dispatch(getFollowings(user?._id));
  }, [currentId, user]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    const { data } = await api.getUsersConversation(currentId, user._id);
    if (data) {
      setCurrentChat(data);
    } else {
      socket.emit("sendConversation", {
        receiverId: user._id,
      });
      dispatch(createConversation({senderId: user._id, receiverId: currentId}));
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div key={o._id} className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt="profile pic"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
