const router = require("express").Router();
const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  getTimelinePost,
  ratePost,
  addComment,
  updateComment,
  userPosts,
  deleteComment,
  getTopItems,
  veganMenu
} = require('../controllers/postsController');
const { protect } = require('../middleware/authMiddleware');


router.post("/", protect, createPost);
router.get("/topItems", getTopItems);
router.get("/veganMenu", veganMenu);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, likePost);
router.get("/:id", getPost);
router.post("/timeline", protect, getTimelinePost);
router.get("/profile/:id", userPosts);
router.put("/rate/:id", protect, ratePost);
router.put("/comments/:id", protect, addComment);
router.post("/updatecomments", protect, updateComment);
router.put("/delcomments/:id", protect, deleteComment);

module.exports = router;
