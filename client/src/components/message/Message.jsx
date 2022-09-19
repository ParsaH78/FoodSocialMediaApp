import "./message.css";
import { format } from "timeago.js";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import {deleteMessage} from "../../actions/ChatActions";
import { useDispatch } from "react-redux";

export default function Message({ message, own, setNewMessage, setEditId, socket, currentChat, user}) {
  const [setting, setSetting] = useState(false);
  const dispatch = useDispatch();

  const deleteMessages = async () => {
    const receiverId = currentChat.members?.find(
      (member) => member !== user._id
    );
    socket.emit("sendDelete", {
      receiverId,
    });
    dispatch(deleteMessage(message._id));
  }

  const editMessages = async () => {
    setEditId(message._id);
    setNewMessage(message.text);
    setSetting(prev => !prev);
  }

  const showSetting = () => {
    if (own) {
      setSetting(prev => !prev);
    }
  }

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <div className="textBox" onClick={() => showSetting()}>
          <p className="messageText">{message.text}</p>
        </div>
        <div className={setting ? "settingBox" : "noSettingBox"}>
          <DeleteIcon className="deleteIcon" onClick={() => deleteMessages()}/>
          <EditIcon className="editIcon" onClick={() => editMessages()}/>
        </div>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
