import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {getMe} from "../../actions/UserActions";
import {getConversation, getMessage, addMessage, editMessage} from "../../actions/ChatActions";
import { io } from "socket.io-client";

export default function Messenger() {
  document.title = "پیام‌رسان"

  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const { currentUser: user } = useSelector((state) => state.user);
  const { conversations, messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    setSocket(io("ws://localhost:8900"));
  }, []);

  useEffect(() => {
    if (user) {
      socket?.emit("addUser", user?._id);
    }
  }, [user, socket]);

  useEffect(() => {
    socket?.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket, messages]);

  useEffect(() => {
    socket?.on("getConversation", () => {
      dispatch(getConversation(user?._id));
    });
  }, [socket, conversations]);

  useEffect(() => {
    socket?.on("getDelete", () => {
      dispatch(getMessage(currentChat?._id));
    });
  }, [socket, messages]);

  useEffect(() => {
    socket?.on("getDelete", () => {
      dispatch(getConversation(user?._id));
    });
  }, [socket, conversations]);


  useEffect(() => {
    if (user) {
      socket?.on("getUsers", (users) => {
        setOnlineUsers(
          user.followings.filter((f) => users.some((u) => u.userId === f))
        );
      });
    }
  }, [user, socket]);

  useEffect(() => {
    dispatch(getConversation(user._id));
  }, [user]);

  useEffect(() => {
    if (currentChat) {
      dispatch(getMessage(currentChat._id));
    }
  }, [currentChat, arrivalMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.length !== 0) {
    
    let message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members?.find(
      (member) => member !== user._id
    );

    if (editId) {
      message = {...message, _id: editId}; 
      socket.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage,
      });
      dispatch(editMessage(message));
      setEditId(null);
    } else {
      socket.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage,
      });
      dispatch(addMessage(message));
    }
    setNewMessage("");
  }

  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="conversationsTitle">
              <h4 className="titleText">گفتگو ها</h4>
            </div>
            <hr className="titleSeparator" />
            {conversations && conversations?.map((c, i) => (
              <div>
                <Conversation key={i}
                 conversation={c} 
                 currentUser={user} 
                 setCurrentChat={setCurrentChat}
                 socket={socket}
                 user={user}
                  />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
          <div className="conversationsTitle">
              <h4 className="titleText">گفتگو</h4>
          </div>
            <hr className="titleSeparator" />
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, i) => (
                    <div ref={scrollRef}>
                      <Message key={i} 
                        message={m} 
                        own={m.sender === user._id} 
                        setNewMessage={setNewMessage}
                        setEditId={setEditId}
                        socket={socket}
                        currentChat={currentChat}
                        user={user}/>
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={(e) => handleSubmit(e)}>
                    ارسال
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                صفحه ای باز نیست
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
          <div className="conversationsTitle">
              <h4 className="titleText">دوستان آنلاین</h4>
            </div>
            <hr className="titleSeparator" />
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
              socket={socket}
            />
          </div>
        </div>
      </div>
    </>
  );
}
