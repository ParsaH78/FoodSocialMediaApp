const Post = require("../models/Post");
const User = require("../models/User");

//create a post

const createPost = async (req, res) => {
  let body = req.body;
  body = {...body, userId: req.user.id};
  const newPost = new Post(body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
};

//update a post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({message : 'Post not found'});
    }
  
    if (!req.user) {
      return res.status(401).json({message: "User not found"});
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({message: 'User not authorized'});
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
};

//delete a post
const deletePost = async (req, res) => {
  try {
    
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(400).json({message : 'Post not found'});
    }
    
    if (!req.user) {
      return res.status(401).json({message: "User not found"});
    }
    
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({message: 'User not authorized'});
    }
    
    await post.remove()
    
    res.status(200).json({ id: req.params.id })
  } catch (error) {
    return res.status(500).json(error);
  }
};

//like / dislike a post
const likePost = async (req, res) => {

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({message : 'Post not found'});
    }
    
    if (!req.user) {
      return res.status(401).json({message: "User not found"});
    }

    if (!post.likes.includes(req.user.id)) {
      const updated = await Post.findByIdAndUpdate(req.params.id, 
        { $push: { likes: req.user.id } }, 
        {new : true});
      res.status(200).json(updated);
    } else {
      const updated = await Post.findByIdAndUpdate(req.params.id, 
        { $pull: { likes: req.user.id } }, 
        {new : true});
      res.status(200).json(updated);
    }
  } catch (err) {
    return res.status(500).json(err);
  }

};

//get a post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
};

//get timeline posts
const getTimelinePost = async (req, res) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({message: "User not found"});
    }

    const currentUser = await User.findById(req.user.id);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
};

//get user's all posts
const userPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const posts = await Post.find({ userId: user._id });
    res.status(200).send(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
};

//update post rating
const ratePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({message : 'Post not found'});
    }
    
    if (!req.user) {
      return res.status(401).json({message: "User not found"});
    }
  
    if (req.body.user !== req.user.id) {
      return res.status(401).json({message: "User doesn't match"});
    }

    let ratings = post.rating;
    ratings = ratings.filter((item) => item.user !== req.user.id);
    ratings = [...ratings, req.body];
    const updated = await Post.findByIdAndUpdate(req.params.id, {rating: ratings}, {new: true});

    let rating = updated.rating;

    let result = 0;
    rating.forEach((rate) => {
        for (let key in rate) {
            if (key === "rate") {
                result += parseFloat(rate[key]);
            }
        }
      })
      const score = result / rating.length;
    const updatePost = await Post.findByIdAndUpdate(updated._id, {score: score}, {new: true});

    res.status(200).json(updatePost);

  } catch (err) {
    return res.status(500).json(err);
  }
};

//add post comment
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({message : 'Post not found'});
    }
    
    if (!req.user) {
      return res.status(401).json({message: "User not found"});
    }
  
    if (req.body.userId !== req.user.id) {
      return res.status(401).json({message: "User doesn't match"});
    }
    let comments = post.comments;
    comments = [...comments, req.body];
    const updated = await post.update({comments: comments});
    res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateComment = async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.body)
    const posts = await Post.find();
    console.log("posts : ", posts);
    if (!req.user) {
      return res.status(401).json({message: "User not found"});
    }

    let userId = req.body.id;


    posts.map(async (post) => {
      let allComments = post.comments;
      allComments.map((comment) => {
        if (comment.userId == userId) {
          comment.image = req.body.image;
        };
      });
      console.log("comment : ", allComments);
      try {
        await post.updateOne({comments: allComments});
      } catch (error) {
        return res.status(500).json({message: `error in post ${post.name}`});
      }
    });

    res.status(200).json({messsage: "Done"});
  } catch (error) {
    return res.status(500).json({message: `Error : ${error}`});
  }
}

//delete post comment
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({message : 'Post not found'});
    }
    
    if (!req.user) {
      return res.status(401).json({message: "User not found"});
    }
  
    let commentId =  req.body.id;
    let allComments = post.comments;
    allComments = allComments.filter(all => {
      return all._id !== commentId;
    });
    const updated = await post.update({comments: allComments});
    res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json(error);
  }
};


const getTopItems = async (req, res) => {
  try {
    const allPosts = await Post.find();
    let scores = [];
    allPosts.map(item => {
      scores.push({
         _id: item._id,
         score: item.score,
         name: item.name,
         img: item.img,
         likes: item.likes,
         createdAt: item.createdAt,
         userId: item.userId
        });
    });

    scores.sort((a, b) => b.score - a.score);

    scores.slice(0, 10);

    res.status(200).send(scores);

  } catch (error) {
    return res.status(500).json(error);
  }
}

const veganMenu = async (req, res) => {
  try {
    let menu = [];
    const all_posts = await Post.find();
    all_posts.map((post) => {
      if (post.vegan === "true") {
        menu.push(post);
      }
    });

    res.status(200).json(menu);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
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
};
