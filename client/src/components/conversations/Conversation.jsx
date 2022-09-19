import { useEffect, useState } from "react";
import "./conversation.css";
import * as api from '../../api/index.js';
import DeleteIcon from '@mui/icons-material/Delete';
import {useDispatch} from "react-redux";
import {deleteConversation} from "../../actions/ChatActions";

export default function Conversation({ conversation, currentUser, setCurrentChat, socket, user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

      const getUser = async () => {
        const { data } = await api.getUser({userId: friendId});
        setUserDetail(data);
      }
      
      getUser();

  }, [currentUser, conversation]);

  const handleDelete = () => {
    const receiverId = conversation.members?.find(
      (member) => member !== user._id
    );
    socket.emit("sendDelete", {
      receiverId,
    });
    dispatch(deleteConversation(conversation._id));
    setCurrentChat(null);
  }

  return (
    <div className="conversation">
      <div className="convBox" onClick={() => setCurrentChat(conversation)}>
        <img
          className="conversationImg"
          src={
            userDetail?.profilePicture
              ? PF + userDetail.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt="profile pic"
        />
        <span className="conversationName">{userDetail?.username}</span>
      </div>
      <div>
        <DeleteIcon className="deleteConv" onClick={() => handleDelete()}/>
      </div>
    </div>
  );
}
