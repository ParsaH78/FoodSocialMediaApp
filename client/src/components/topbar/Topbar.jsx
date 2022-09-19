import "./topbar.css";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import decode from 'jwt-decode';
import { logout } from "../../actions/AuthActions";
import * as api from "../../api/index";

export default function Topbar() {
  const { currentUser: user } = useSelector((state) => state.user);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) dispatch(logout());
    }

  }, [location]);

  useEffect(() => {
    const search = async () => {
      const res = await api.search(searchText);
      setSearchResult(res.data);
    }
    if (searchText?.length > 2) {
      search();
    } else {
      setSearchResult([]);
    }
  }, [searchText]);

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">FoodMedia</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input
            type="text"
            value={searchText}
            placeholder="جستجو (حداقل سه کاراکتر وارد کنید)"
            className="searchInput"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className={searchResult.length > 0 ? "showResult" : "resultBox"}>
          <div className="resultTitle">
              <h2 className="titleText">نتایج جستجو</h2>
              <div className="titleIcon"><SearchIcon fontSize="small"/></div>
          </div>
          <ul className="resultList">
            {searchResult.map(res => (
                <>
                <li className="resultItem">
                  <a href={`/profile/${res._id}`}>
                      <img className="resultImg" 
                      src={res.profilePicture
                          ? PF + res.profilePicture
                          : PF + "person/noAvatar.png"} 
                      alt="profile pic" 
                      />
                  </a>
                  <a href={`/profile/${res._id}`} style={{textDecoration: 'none', color: 'black'}}>
                      <span className="resultName">{res.username}</span>
                  </a>
                </li>
                <hr className="resultSeparator" />
                </>
              ))}
          </ul>
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink"><Link to="/" style={{textDecoration: "none", color: "white"}}><p>صفحه اصلی</p></Link></span>
          <span className="topbarLink"><Link to={`/profile/${user._id}`} style={{textDecoration: "none", color: "white"}}><p>پروفایل</p></Link></span>
        </div>
        <Link to={`/profile/${user._id}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt="profile pic"
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
