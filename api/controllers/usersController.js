const User = require("../models/User");
const Post = require("../models/Post");

//update user
const updateUser = async (req, res) => {

  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  
  if (req.body._id === req.user.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
      })
      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
};

//get a user
const getUser = async (req, res) => {
  const {userId, username} = req.body;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user)
};

//get friends
const getFriends = async (req, res) => {

  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).send(friendList)
  } catch (err) {
    return res.status(500).json(err);
  }
  
};

//get followings 
const getFollowings = async (req, res) => {

  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).send(friendList)
  } catch (err) {
    return res.status(500).json(err);
  }
};

//follow a user
const followUser = async (req, res) => {

  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }
  
  if (req.body.userId !== req.user.id) {
    try {
      const currentUser = await User.findById(req.user.id);
      const user = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { followings: req.body.userId } });
        res.status(200).send(req.body.userId);
      } else {
        return res.status(403).json("you already follow this user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you cant follow yourself");
  }
};

//unfollow a user
const unfollowUser = async (req, res) => {

  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }

  if (req.body.userId !== req.user.id) {
    try {
      const currentUser = await User.findById(req.user.id);
      const user = await User.findById(req.body.userId);
      if (user.followers.includes(req.user.id)) {
        await user.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({ $pull: { followings: req.body.userId } });
        res.status(200).send(req.body.userId);
      } else {
        return res.status(403).json("you don't follow this user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you cant unfollow yourself");
  }
};

// search user
const searchUser = async (req, res) => {
  const {query} = req.query;
  try {
      const allUsers = await User.find({}).select("-password -createdAt -updatedAt -isAdmin");

      const keys = ["username"];

      const search = (data) => {
        return data.filter((item) =>
          keys.some((key) => item[key].includes(query)));
      };

      const result = search(allUsers);

      res.status(200).send(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const addToFavorite = async (req, res) => {

  if (!req.user) {
    return res.status(401).json({message: "User not found"});
  }

  try {
    const selectedPost = await Post.findById(req.body.postId);
    let currentUser = await User.findById(req.user.id);
    let favorites = [];

    const chosenProps = {
      _id: selectedPost._id,
      name: selectedPost.name,
      img: selectedPost.img,
      likes: selectedPost.likes,
      createdAt: selectedPost.createdAt,
      score: selectedPost.score,
      userId: selectedPost.userId
    };

    currentUser.favorites?.map(item => {
        favorites.push(item._id.toString());
    });

    if (favorites.includes(req.body.postId)) {
      currentUser = await User.findByIdAndUpdate(req.user.id, 
        { $pull: { favorites: chosenProps } }, 
        {new : true});
    } else {
      currentUser = await User.findByIdAndUpdate(req.user.id, 
        { $push: { favorites: chosenProps } }, 
        {new : true});      
    }

    res.status(200).json(currentUser.favorites);
  } catch (error) {
    return res.status(500).json({message: "Error 500"});
  }

}


module.exports = {
  updateUser,
  getUser,
  getMe,
  getFriends,
  getFollowings,
  followUser,
  unfollowUser,
  searchUser,
  addToFavorite,
};
