const router = require("express").Router();
const {
  updateUser,
  getUser,
  getMe,
  getFriends,
  getFollowings,
  followUser,
  unfollowUser,
  searchUser,
  addToFavorite,
} = require("../controllers/usersController");
const { protect } = require('../middleware/authMiddleware');


router.put("/", protect, updateUser);

router.post("/", getUser);

router.get('/me', protect, getMe);

router.get("/friends/:userId", getFriends);

router.get("/followings/:userId", getFollowings);

router.put("/follow", protect, followUser);

router.put("/unfollow", protect, unfollowUser);

router.get("/search", searchUser);

router.put("/favorite", protect, addToFavorite);


module.exports = router;
