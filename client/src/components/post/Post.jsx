import "./post.css";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import { useSelector, useDispatch } from "react-redux";
import * as api from '../../api/index.js';
import {likePost} from "../../actions/PostActions";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentUser } = useSelector((state) => state.user);
  const [creator, setCreator] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setIsLiked(post.likes.includes(currentUser._id));
    }
    return () => { isMounted = false };
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await api.getUser({userId: post.userId});
      setCreator(data);
    }
    getUser();
  }, [post]);

  const likeHandler = () => {
    dispatch(likePost(post._id));
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${creator?._id}`}>
              <img
                className="postProfileImg"
                src={
                  creator?.profilePicture
                    ? PF + creator?.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt="profile pic"
              />
            </Link>
            <span className="postUsername">{creator?.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.name}</span>
          <img className="postImg" src={PF + post.img[0]} alt="post pic" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <div className="likeBox">
              <img
                className="likeIcon"
                src={`${PF}heart.png`}
                onClick={() => likeHandler()}
                alt="like pic"
              />
              <span className="postLikeCounter">{like}</span>
              </div>
              <div className="rateBox">
                <div className="postRate">
                  <Rating name="half-rating" defaultValue={post.score} precision={0.5} readOnly size="medium"/>
                </div>
              </div>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText postComment"><Link to={`/post/${post._id}`} style={{textDecoration: "none", color: "black"}}>دستورپخت کامل</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
}
