const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

//new conv

const createConversation = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    return res.status(500).json(err);
  }
};

//get conv of a user

const getConversation = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });

    res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// get conv includes two userId
const getUsersConversation = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteConversation = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    await Message.deleteMany({conversationId: req.params.id});
    res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  createConversation,
  getConversation,
  getUsersConversation,
  deleteConversation
};

