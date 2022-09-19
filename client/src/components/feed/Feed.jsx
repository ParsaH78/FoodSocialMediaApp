import { useEffect, useState } from "react";
import Post from "../post/Post";
import "./feed.css";
import {Link} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {timelinePosts} from "../../actions/PostActions";

export default function Feed({ filteredPost, favoriteItems, topItems, veganItems, setRightMobile, setLeftMobile, leftMobile, rightMobile }) {
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const { currentUser: user } = useSelector((state) => state.user);
  const { posts: currentPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (filteredPost.length == 0) {
      setNewPosts([]);
    }
    if (topItems?.length > 0) {
      topItems.sort((a, b) => b.score - a.score);
    } else if (veganItems?.length === 0) {
      dispatch(timelinePosts());
    } else {
      veganItems.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    }
  }, [topItems, veganItems, user]);

  useEffect(() => {
    setPosts(
      currentPosts.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    );

  }, [currentPosts]);

  useEffect(() => {
    let oldPost = [];
    let newPost = [];
    if (topItems.length > 0) {
      oldPost = [...topItems];
    } else if (veganItems.length > 0) {
      oldPost = [...veganItems];
    } else if (favoriteItems.length > 0) {
      oldPost = [...favoriteItems];
    } else {
      oldPost = [...posts];
    }
    oldPost.map((post) => {
      const filterResult = filteredPost?.every(filter => post.category.includes(filter));
      if (filterResult) {
        newPost.push(post);
      }
    })
    setNewPosts(newPost);
  }, [filteredPost]);

  const RightMobileMenu = () => {
    setRightMobile(prev => !prev);
  }

  const LeftMobileMenu = () => {
    setLeftMobile(prev => !prev);
  }

  const ShareButton = () => {
    return (
      <>
        <button className="shareButton"><Link style={{textDecoration: "none", color: "white"}} to="/share">به اشتراک بگذارید</Link></button>
      </>
    )
  }

  return (
    <div className="feed">
      <div className="feedWrapper">
        <div className="hamburgers">
          <button className={rightMobile ? "hamburger is-active" : "hamburger"} onClick={() => RightMobileMenu()}>
            <div className="bar"></div>
          </button>
          <button className={leftMobile ? "hamburger is-active" : "hamburger"} onClick={() => LeftMobileMenu()}>
            <div className="bar"></div>
          </button>
        </div>
        <ShareButton />
        {topItems?.length == 0 && veganItems?.length == 0 && newPosts.length == 0 && favoriteItems.map(item => (
          <Post key={item._id} post={item} />
        ))}
        {favoriteItems?.length == 0 && veganItems?.length == 0 && newPosts.length == 0 &&  topItems.map(item => (
          <Post key={item._id} post={item} />
        ))}
        {favoriteItems?.length == 0 && topItems?.length == 0 && newPosts.length == 0 &&  veganItems.map((p) => (
          <Post key={p._id} post={p} />
        ))}
        {favoriteItems?.length == 0 && topItems?.length == 0 &&  veganItems?.length == 0 && newPosts.length == 0 && 
        posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
        {newPosts.length > 0 && 
        newPosts.map((p) => (
          <Post key={p._id} post={p} />
        ))}

      </div>
    </div>
  );
}
