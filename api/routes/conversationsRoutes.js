const router = require("express").Router();
const {
  getConversation,
  createConversation,
  getUsersConversation,
  deleteConversation
} = require('../controllers/conversationsController');
const { protect } = require('../middleware/authMiddleware');


router.post("/", protect, createConversation);
router.get("/:userId", protect, getConversation);
router.get("/find/:firstUserId/:secondUserId", protect, getUsersConversation);
router.delete("/:id", protect, deleteConversation);

module.exports = router;
