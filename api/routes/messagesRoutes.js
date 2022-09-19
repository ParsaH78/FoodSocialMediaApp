const router = require("express").Router();
const {
  addMessage,
  getMessage,
  deleteMessage,
  editMessage
} = require('../controllers/messagesController');
const { protect } = require('../middleware/authMiddleware');

router.post("/", protect, addMessage);
router.get("/:conversationId", protect, getMessage);
router.delete("/:id", protect, deleteMessage);
router.put("/", protect, editMessage);

module.exports = router;
