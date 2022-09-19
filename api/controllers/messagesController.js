const Message = require("../models/Message");

//add
const addMessage = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    return res.status(500).json(err);
  }
};

//get
const getMessage = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteMessage = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  const messageId = req.params.id;

  try {
    const deleted = await Message.findByIdAndDelete(messageId);

    return res.status(200).json(deleted._id);
  } catch (error) {
    return res.status(500).json(err);
  }
}

const editMessage = async(req, res) => {
  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  if (req.body.sender === req.user.id) {
    try {
      const message = await Message.findByIdAndUpdate(req.body._id, req.body, {new: true});
      res.status(200).json(message);
    } catch (error) {
      return res.status(500).json({message: "Error in editing message"});
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
}

module.exports = {
  addMessage,
  getMessage,
  deleteMessage,
  editMessage
}