import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Messenger from "./pages/messenger/Messenger";
import ShareFood from "./pages/share/ShareFood";
import Post from "./pages/post/Post";
import { useSelector } from "react-redux";

function App() {

  const {currentUser: user} = useSelector((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/messenger" element={!user ? <Navigate to="/" /> : <Messenger/>} />
        <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/register" />} />
        <Route path="/share" element={user ? <ShareFood /> : <Navigate to="/register" />}/>
        <Route path="/post/:id" element={user ? <Post /> : <Navigate to="/register" />}/>       
      </Routes>
    </Router>
  );
}

export default App;

