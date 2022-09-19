const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true
    },
    explain: {
      type: String,
      default: ""
    },
    desc: {
      type: Array,
      required: true
    },
    img: {
      type: Array,
      required: true
    },
    likes: {
      type: Array,
      default: [],
    },
    readytime: {
      type: Number,
      default: ""
    },
    ingredients: {
      type: Array,
      required: true
    },
    category: {
      type: Array,
      required: true
    },
    vegan: {
      type: String,
      default: "نیست"
    },
    rating: {
      type: Array,
      default: 0
    },
    comments: {
      type: Array,
      default: []
    },
    score: {
      type: Number,
      default: 0
    },
    people: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
