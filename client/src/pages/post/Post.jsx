import React, { useRef } from 'react';
import "./post.css";
import { useParams } from "react-router";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from 'react';
import { useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import Rating from '@mui/material/Rating';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { v4 } from "uuid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import ShareFood from "../share/ShareFood";
import { useSelector, useDispatch } from "react-redux";
import {getMe, addToFavorite} from "../../actions/UserActions";
import {postDetails, ratePost, addComment, deleteComment, deletePost} from "../../actions/PostActions";
import FavoriteIcon from '@mui/icons-material/Favorite';
import * as api from '../../api/index.js';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';

export default function Post() {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const id = useParams().id;
    const [rate, setRate] = useState(0);
    const [defRate, setDefRate] = useState(0);
    const [comments, setComments] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const { posts, postDetails: data } = useSelector((state) => state.post);
    const [favoriteStyle, setFavoriteStyle] = useState("addToFavorite");
    const [isFavorite, setIsFavorite] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [creator, setCreator] = useState({});
    document.title = data?.name;

    const [edit, setEdit] = useState(false);
    const comment = useRef();

    useEffect(() => {
        dispatch(getMe());
        dispatch(postDetails(id));
    }, []);

    useEffect(() => {
        dispatch(postDetails(id));
    }, [posts]);

    useEffect(() => {
        if (data !== null) {
            const getUser = async () => {
                const { data: create } = await api.getUser({userId: data.userId});
                setCreator(create);
            }
            getUser();
            setComments(data.comments);
            rateStuff();
        }
    }, [id, data, posts]);

    useEffect(() => {
        if (currentUser.favorites) {
            currentUser.favorites?.map(item => {
                if (item._id === data?._id) {
                    setIsFavorite(true);
                } else {
                    setIsFavorite(false);
                }
            });
        }
    }, [currentUser, data]);

    useEffect(() => {
        if (isFavorite) {
            setFavoriteStyle(prev => prev.concat(" redColor"));
        } else {
            setFavoriteStyle(prev => prev.replace(" redColor", ""));
        }
    }, [isFavorite]);

    const rateStuff = () => {
        let rating = data.rating;

        if (rating.length === 0) {
            setDefRate(0);
            setRate(0);
        } else {
            setDefRate(setDefaultRate());
            const userRate = getRating();
            setRate(userRate.rate);
        }
    }

    const setDefaultRate = () => {
        let rating = data.rating;

        let result = 0;
        rating.forEach((rate) => {
            for (let key in rate) {
                if (key === "rate") {
                    result += parseFloat(rate[key]);
                }
            }
          })
        return result / rating.length;
    }

    const getRating = () => {
        let rating = data.rating;

        rating.forEach((rate) => {
            for (let key in rate) {
              if (key === "user" && rate[key] === currentUser._id) {
                return parseFloat(rate);
              }
            }
          })
        return {user: currentUser._id, rate: 0}
    }


    const handleStars = async (e) => {
        setRate(e.target.value);
        const newRate = {user: currentUser._id, rate: e.target.value};
        dispatch(ratePost(data._id, newRate));
        setDefRate(setDefaultRate());

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const comment_id = v4();
        const newComment = {
            _id: comment_id,
            userId: currentUser._id, 
            username: currentUser.username, 
            image: currentUser.profilePicture, 
            comment: comment.current.value
        };
        dispatch(addComment(data._id, newComment));
        comment.current.value = "";

    }

    const delPost = async () => {
        dispatch(deletePost(data._id, navigate, currentUser._id));
    }

    const delComment = async (e, id) => {
        dispatch(deleteComment(data._id, {id: id}));
    }

    const addFavorite = () => {
        dispatch(addToFavorite({postId : data._id}));
        setIsFavorite(prev => !prev);
    }

    const [current, setCurrent] = useState(0);
  
    const nextSlide = () => {
      setCurrent(current === data.img.length - 1 ? 0 : current + 1);
    };
  
    const prevSlide = () => {
      setCurrent(current === 0 ? data.img.length - 1 : current - 1);
    };

  return (
    <>

    {!data &&     
    <div className="loadingBox">
        <CircularProgress style={{color: "#ff8181", width: "10%", height: "10%"}}/>
        <h4 className="loadingText">در حال بارگذاری</h4>
    </div>}
    {data && edit && <ShareFood post={data} />}
    {data && !edit &&
    <div className="page">
    <Topbar />
    <div className="postContainer">
        <Sidebar/>
        <div className="post">
            <div className="postWrapper">
                <div className="postLeft">
                    <div className="postBox">
                        <div>
                            <section className="slider">
                                {data.img && data.img.length > 1 && 
                                <>
                                    <FaArrowAltCircleLeft className='left-arrow' onClick={prevSlide} />
                                    <FaArrowAltCircleRight className='right-arrow' onClick={nextSlide} />
                                </>}
                                {data.img && data.img.map((slide, index) => {
                                    return (
                                    <div className={index === current ? 'slide active' : 'slide'} key={index}>
                                        {index === current && (
                                            <img src={PF + slide} alt="post pic" className='image'/>
                                        )}
                                    </div>
                                    )}
                                )}
                            </section>
                        </div>
                        <div className="postCreator">
                            <div className="postCreatorProfile">
                                <a href={`/profile/${creator?._id}`}>
                                    <img className="postCreatorImg" 
                                    src={creator?.profilePicture 
                                    ? PF + creator.profilePicture 
                                    : PF + "person/noAvatar.png"} 
                                    alt="profile pic" />
                                </a>
                                <a href={`/profile/${creator?._id}`} style={{color: "black", textDecoration: "none"}}>
                                    <span className="postCreatorName">{creator?.username}</span>
                                </a>
                            </div>
                            <div>
                                <FavoriteIcon className={favoriteStyle} fontSize='large' style={{cursor: "pointer"}} onClick={addFavorite}/>
                            </div>
                            {currentUser._id === data.userId && 
                            <div className="postCreatorEditDelete">
                                <div className="postCreatorButton postEdit" onClick={() => setEdit(!edit)}><EditIcon /></div>
                                <div className="postCreatorButton postDelete" onClick={delPost}><DeleteIcon /></div>
                            </div>}
                        </div>
                        <hr className="shareHr" />
                        <div className='postText'>
                            <span className="postTextItem">{data.name}</span>
                        </div>
                        <div className="postExplainBox">
                            <span className="postExplainText">
                            {data.explain.length === 0 ? "توضیحی برای این دستورپخت وجود ندارد" : data.explain}
                            </span>
                        </div>
                        <div className="postDetails">
                            <div className="rightSide">
                                {data.ingredients &&
                                <fieldset className="postIngredient">
                                <div className="postIngredientTitleBox">
                                    <div className="titleTextBox">
                                        <span className="postIngredientTitle">مواد لازم</span>
                                    </div>
                                    <div className="peopleBox">
                                        <span className="postIngredientTitle">{data?.people}</span>
                                        <PersonIcon className="peopleIcon"/>
                                    </div>
                                </div>
                                    {data.ingredients.map((inger) => (
                                    <div className="ingerBox">
                                        <div className="ingerNameBox">
                                            <span className="ingerName colored">{inger.name}</span>
                                        </div>
                                        <div className="ingerAmountBox">
                                            <span className="ingerAmount colored">{inger.amount}</span>
                                            <span className="ingerType colored">{inger.type}</span>
                                        </div>
                                    </div>
                                ))}
                                </fieldset>
                                }
                            </div>
                            <div className="leftSide">
                                <fieldset className='postReadyTime'>
                                <div className="postReadyTimeTitleBox">
                                    <span className="postReadyTimeTitle">زمان تهیه</span>
                                </div>
                                <div className="postReadyTimeText">
                                    <span className="postText colored">{`${data.readytime} دقیقه`}</span>  
                                    <span className="postReadyTimeIcon colored">
                                        <AccessTimeIcon />
                                    </span>
                                </div>
                                </fieldset>
                                <fieldset className='postDesc'>
                                    <legend>طرز تهیه</legend>
                                    <ol className="postDescList">
                                        {data.desc && data.desc.map((d) => (
                                            <>
                                            <li className="postDescBox">
                                                <p className="desc colored">{d.name}</p>
                                            </li>
                                            <hr className='descSeparator'/>
                                            </>
                                            ))}
                                    </ol>
                                </fieldset>
                                <fieldset className="postCategory">
                                    <legend className="postCategoryLegend">دسته بندی ها</legend>
                                    <div className="postCategoryTextBox">
                                        {data.category && data.category.map((cat) => (
                                            <span className="postCategoryText colored">{cat}</span>
                                            ))}
                                    </div>
                                </fieldset>
                                <fieldset className="postVegan">
                                    <legend className="postVeganLegend">گیاهی</legend>
                                    <span className="postText postVeganText colored">{ data.vegan === "false" ? "نیست" : "هست" }</span>  
                                </fieldset>
                            </div>
                        </div>
                        <div className="postRatingBox">
                            <div className="currentRating" style={{direction: "ltr"}}>
                                <span className="postText"> : امتیاز </span>
                                <Rating name="half-rating" value={defRate} precision={0.5} readOnly size="large"/>
                            </div>
                            <div className="userRating" style={{direction: "ltr"}}>
                                <span className="postText"> : امتیاز دهید </span>
                                <Rating name="half-rating" defaultValue={rate} precision={0.5} size="large" onChange={handleStars}/>
                            </div>
                        </div>
                        <hr className="shareHr" />
                        <div className="postCommentBox">
                            <div className="postCommentTitleBox">
                                <div className="postCommentTitleText">
                                    <span className="postCommentTitle">نظرات</span>
                                </div>
                            </div>
                            <div className="postCommentItemsBox">
                                <div className="postCommentItemUser">
                                    <div className="postCommentCreator">
                                        <img className="postCommentCreatorImg" 
                                        src={currentUser?.profilePicture 
                                        ? PF + currentUser.profilePicture 
                                        : PF + "person/noAvatar.png"} 
                                        alt="profile pic" />
                                        <span className="postCommentCreatorName">{currentUser?.username}</span>
                                    </div>
                                </div>
                                <div className="postCommentLine"></div>
                                <form className="postCommentForm" onSubmit={handleSubmit}>
                                    <div className="postCommentItemText">
                                        <textarea ref={comment} className="postCommentUserText"></textarea>
                                    </div>
                                    <div className="postCommentButton">
                                        <button type="submit" className="postCommentSubmitButton">ثبت نظر</button>
                                    </div>
                                </form>
                            </div>
                            {comments && comments.map(comment => (
                            <div className="postCommentItemsBox">
                                <div className="postCommentItemUser">
                                    <div className="postCommentCreator">
                                        <img className="postCommentCreatorImg" 
                                        src={comment?.image 
                                        ? PF + comment.image 
                                        : PF + "person/noAvatar.png"} 
                                        alt="profile pic" />
                                        <span className="postCommentCreatorName">{comment?.username}</span>
                                    </div>
                                </div>
                                <div className="postCommentLine"></div>
                                <div className="commentBox">
                                    <span className="postCommentCreatorName">{comment?.comment}</span>
                                    {(comment.username === currentUser.username || creator.username === currentUser.username) &&
                                        <button className="deleteButton" onClick={(e) => delComment(e, comment._id)}>
                                            <DeleteIcon className="deleteIcon" />
                                        </button>
                                    }
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    }
    </>
  )
}
