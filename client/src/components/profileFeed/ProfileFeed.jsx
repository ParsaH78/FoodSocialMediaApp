import { useEffect, useState } from "react";
import Post from "../post/Post";
import "./profileFeed.css";
import {Link} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {userPosts} from "../../actions/PostActions";

export default function ProfileFeed({ userId, filteredPost }) {
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const { currentUser: user } = useSelector((state) => state.user);
  const { userPosts: currentPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userPosts(userId));
  }, [userId]);

  useEffect(() => {
    setPosts(
      currentPosts.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    );
    setNewPosts(
      currentPosts.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    );

  }, [currentPosts]);

  useEffect(() => {
    let newPost = [];
    posts.map((post) => {
      const filterResult = filteredPost?.every(filter => post.category.includes(filter));
      if (filterResult) {
        newPost.push(post);
      }
    })
    setNewPosts([...newPost]);
  }, [userId, filteredPost]);

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
        {(!userId || userId === user._id) && <ShareButton />}
        {newPosts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
