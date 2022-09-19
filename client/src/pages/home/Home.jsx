import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Leftbar from "../../components/leftbar/Leftbar";
import "./home.css"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {getMe} from "../../actions/UserActions";

export default function Home() {

  document.title = "صفحه اصلی"

  const [filteredPost, SetFilteredPost] = useState([]);
  const dispatch = useDispatch();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [veganItems, setVeganItems] = useState([]);
  const [rightMobile, setRightMobile] = useState(false);
  const [leftMobile, setLeftMobile] = useState(false);

  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <>
      <Topbar/>
      <div className="homeContainer">
        <Sidebar 
          filteredPost={filteredPost} 
          SetFilteredPost={SetFilteredPost}
          rightMobile={rightMobile}
          setRightMobile={setRightMobile}
        />
        <Feed
          filteredPost={filteredPost} 
          favoriteItems = {favoriteItems}
          topItems={topItems}
          veganItems={veganItems}
          leftMobile={leftMobile}
          rightMobile={rightMobile}
          setRightMobile={setRightMobile}
          setLeftMobile={setLeftMobile}/>
        <Leftbar 
          setFavoriteItems={setFavoriteItems} 
          setTopItems={setTopItems} 
          setVeganItems={setVeganItems}
          leftMobile={leftMobile}
          setLeftMobile={setLeftMobile}/>
      </div>
    </>
  );
}
