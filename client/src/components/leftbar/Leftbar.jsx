import React, { useEffect, useState } from 'react';
import "./leftbar.css";
import {getTopPosts, veganMenu} from "../../actions/PostActions";
import Online from "../online/Online";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";

export default function Leftbar({ setFavoriteItems, setTopItems, setVeganItems, leftMobile, setLeftMobile }) {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { currentUser } = useSelector((state) => state.user);
    const { posts, veganPosts, topPosts } = useSelector((state) => state.post);
    const [favOn, setFavOn] = useState("علاقه مندی ها");
    const [topOn, setTopOn] = useState("برترین ها");
    const [veganOn, setVeganOn] = useState("منوی گیاهی");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      setSocket(io("ws://localhost:8900"));
    }, []);
  
    useEffect(() => {
      if (currentUser) {
        socket?.emit("addUser", currentUser?._id);
      }
    }, [currentUser, socket]);

    useEffect(() => {
      dispatch(getTopPosts());
    }, [topOn]);

    useEffect(() => {
      dispatch(veganMenu());
    }, [veganOn]);

    useEffect(() => {
        socket?.on("getUsers", (users) => {
          setOnlineUsers(
            currentUser.followings.filter((f) => users.some((u) => u.userId === f))
          );
        })
      }, [socket, currentUser]);

    const handleFavorite = () => {
        if (favOn === "علاقه مندی ها") {
          setFavoriteItems(currentUser.favorites);
          setTopItems([]);
          setTopOn("برترین ها");
          setVeganItems([]);
          setTopOn("منوی گیاهی");
          setFavOn("صفحه اصلی");
        } else {
          setFavoriteItems([]);
          setFavOn("علاقه مندی ها");
        }
      }
    
    const handleTop = () => {
      if (topOn === "برترین ها") {
          setTopItems(topPosts);
          setFavoriteItems([]);
          setFavOn("علاقه مندی ها");
          setVeganItems([]);
          setTopOn("منوی گیاهی");
          setTopOn("صفحه اصلی");
      } else {
          setTopItems([]);
          setTopOn("برترین ها");
      }
    }

    const handleVegan = () => {
      if (veganOn === "منوی گیاهی") {
        setVeganItems(veganPosts);
        setFavoriteItems([]);
        setTopItems([]);
        setFavOn("علاقه مندی ها");
        setTopOn("برترین ها");
        setVeganOn("صفحه اصلی");
      } else {
        setVeganItems([]);
        setVeganOn("منوی گیاهی");
      }
    }

    const LeftMobileMenu = () => {
      setLeftMobile(prev => !prev);
    }

  return (
    <>
    <div className="leftbar">
        <div className="leftbarWrapper">
            <div className="favoriteBox">
                <button className="favoriteBtn" onClick={() => handleFavorite()}>
                    {favOn}
                </button>
                <img className="leftbarFavorite" src={PF +"3102989.jpg"} alt="favorite pic" />
            </div>
            <div className="topBox">
                <button className="topBtn" onClick={() => handleTop()}>
                    {topOn}
                </button>
                <img className="leftbarTop" src={PF +"main_02.jpg"} alt="top posts pic" />
            </div>
            <div className="veganBox">
                <button className="veganBtn" onClick={() => handleVegan()}>
                    {veganOn}
                </button>
                <img className="leftbarTop" src={PF +"vegan.jpeg"} alt="vegan menu pic" />
            </div>
            <h4 className="leftbarTitle">دوستان آنلاین</h4>
            <ul className="leftbarFriendList">
              {onlineUsers.map((u, i) => (
                <Online key={i} userId={u} />
              ))}
            </ul>
        </div>
    </div>


    <div className={leftMobile ? "mobile-nav is-active" : "mobile-nav"}>
        <button className={leftMobile ? "hamburger is-active" : "hamburger"} onClick={() => LeftMobileMenu()}>
          <div className="bar"></div>
        </button>
        <div className="leftbarWrapper">
            <div className="favoriteBox">
                <button className="favoriteBtn" onClick={() => handleFavorite()}>
                    {favOn}
                </button>
                <img className="leftbarFavorite" src={PF +"3102989.jpg"} alt="favorite pic" />
            </div>
            <div className="topBox">
                <button className="topBtn" onClick={() => handleTop()}>
                    {topOn}
                </button>
                <img className="leftbarTop" src={PF +"main_02.jpg"} alt="top posts pic" />
            </div>
            <div className="veganBox">
                <button className="veganBtn" onClick={() => handleVegan()}>
                    {veganOn}
                </button>
                <img className="leftbarTop" src={PF +"vegan.jpeg"} alt="vegan menu pic" />
            </div>
        </div>
    </div>
    </>

    
  )
}
