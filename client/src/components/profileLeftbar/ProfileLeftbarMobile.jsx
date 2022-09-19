import "./profileLeftbar.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import { Country } from "../../dummyData.js";
import { useSelector, useDispatch } from "react-redux";
import {getFollowers, followUser, unfollowUser, updateUser} from "../../actions/UserActions";
import {logout} from "../../actions/AuthActions";
import * as api from '../../api/index.js';


export default function ProfileLeftbarMobile({ user, leftMobile, setLeftMobile }) {
  const { currentUser, followersData: friends } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [editProfile, setEditProfile] = useState({
    country: "",
    city: "",
    relationship: ""
  });
  const [edit, setEdit] = useState(false);
  const [followed, setFollowed] = useState(false);


  let type = null;
  let options = null;

  useEffect(() => {
    if (user?._id) {
      dispatch(getFollowers(user?._id));
    }
    setFollowed(currentUser.followings?.includes(user?._id));
    setEditProfile({
      country: currentUser.country,
      city: currentUser.city,
      relationship: currentUser.relationship
    });
  }, [posts]);

  const handleClick = () => {
    if (followed) {
      dispatch(unfollowUser({userId: user._id}));
    } else {
      dispatch(followUser({userId: user._id}));
    }
    setFollowed(!followed);
  };

  const handleLogout = () => {
    dispatch(logout());
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    const newData = {
      _id: currentUser._id,
      desc: desc.current?.value,
      country: editProfile.country,
      city: editProfile.city,
      relationship: editProfile.relationship,
      birthday: editProfile.birthday
    };
    dispatch(updateUser(newData));
    window.location.reload();
  }

  const dynamicCity = () => {
    Country.map((c) => {
      if (c.country === editProfile.country) {
        type = c.city;
      }
    })

    if (type) {
      options = type.map((el) => <option key={el}>{el}</option>);
    }
  }

  dynamicCity();

  const handleChange = (e) => {
    setEditProfile({...editProfile, [e.target.name]: e.target.value});
  }

  const toggleEdit = () => {
    setEdit(!edit);
  }

  const handleChat = async () => {
    let res
    try {
      res = await api.getUsersConversation(currentUser._id, user._id);
    } catch (err) {
      console.log("Error in getting users conversation : ", err);
    }
    if (!res.data) {
        try {
          res = await api.createConversation({senderId: user._id, receiverId: currentUser._id});
        } catch (error) {
          console.log("Error in creating conversation : ", error);
        }
    }
    navigate("/messenger");
  }

  return (
    <div className={leftMobile ? "mobile-nav is-active profileV" : "mobile-nav"}>
    <div className="leftbarWrapper">
      <div>
        {user.username !== currentUser.username && (
          <div className="buttonsBox">
            <button className="leftbarFollowButton" onClick={handleClick}>
              {followed ? "آنفالو" : "فالو"}
              {followed ? <RemoveIcon /> : <AddIcon />}
            </button>
            <button className="leftbarFollowButton" onClick={handleChat}>
              شروع کردن گفتگو
              <ChatIcon />
            </button>
          </div>
        )}
        {user.username === currentUser.username && (
          <div className="buttonWrapper">
            <button className="leftbarExitButton" onClick={handleLogout}>
              {"خروج"}
              {<ExitToAppIcon />}
            </button>
            <button className="leftbarEditButton" onClick={toggleEdit}>
              {!edit && ("ویرایش پروفایل")}
              {edit && ("لغو ویرایش")}
              {<EditIcon />}
            </button>
          </div>
        )}
        <h4 className="leftbarTitle">اطلاعات کاربری</h4>
        {edit && (
          <form onSubmit={handleEdit}>
            <div className="leftbarInfo">
            <div className="leftbarInfoItem">
              <span className="leftbarInfoKey">توضیحات:</span>
              <span className="leftbarInfoValue">
                <input className="editInput" type="text" ref={desc} defaultValue={user.desc}/>
              </span>
            </div>
            <div className="leftbarInfoItem">
              <span className="leftbarInfoKey">کشور:</span>
              <span className="leftbarInfoValue">
                <select name="country" className="editInput" defaultValue={editProfile.country} onChange={(e) => handleChange(e)}>
                  {Country.map((c) => (
                    <option value={c.country}>{c.country}</option>
                  ))}
                </select>
              </span>
            </div>
            <div className="leftbarInfoItem">
              <span className="leftbarInfoKey">شهر:</span>
              <span className="leftbarInfoValue">
              <select name="city" className="editInput" defaultValue={editProfile.city} onChange={(e) => handleChange(e)}>
                  {options}
              </select>
            </span>
            </div>
            <div className="leftbarInfoItem">
              <span className="leftbarInfoKey">وضعیت تاهل:</span>
              <input type="radio" id="single" name="relationship" 
                  className="marriageInput" 
                  defaultChecked={currentUser.relationship === "مجرد" ? true : false}
                  value= "مجرد"
                  onChange={(e) => handleChange(e)}/>
              <label htmlFor="single" className="marriageLabel">مجرد</label>
              <input type="radio" id="married" name="relationship" 
                  className="marriageInput" 
                  defaultChecked={currentUser.relationship === "متاهل" ? true : false}
                  value= "متاهل"
                  onChange={(e) => handleChange(e)}/>
              <label htmlFor="married" className="marriageLabel">متاهل</label>
            </div>
          </div>
          <button type="submit" className="leftbarFollowButton">ذخیره</button>
        </form>
        )}
        {!edit && (
          <div className="leftbarInfo">
          <div className="leftbarInfoItem">
            <span className="leftbarInfoKey">کشور:</span>
            <span className="leftbarInfoValue">{user.country}</span>
          </div>
          <div className="leftbarInfoItem">
            <span className="leftbarInfoKey">شهر:</span>
            <span className="leftbarInfoValue">{user.city}</span>
          </div>
          <div className="leftbarInfoItem">
            <span className="leftbarInfoKey">وضعیت تاهل:</span>
            <span className="leftbarInfoValue">
              {user.relationship}
            </span>
          </div>
        </div>
        )}
        <h4 className="leftbarTitle">دوستان</h4>
        <div className="leftbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend._id}
              style={{ textDecoration: "none" }}
            >
              <div className="leftbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt="profile pic"
                  className="leftbarFollowingImg"
                />
                <span className="leftbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
