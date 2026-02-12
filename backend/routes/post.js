const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// CREATE POST
router.post("/", auth, async (req, res) => {
  try {
    const { image, caption } = req.body;

    const newPost = new Post({
      user: req.userId,
      image,
      caption,
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id).populate(
      "user",
      "username profilePic"
    );

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.log("CREATE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET ALL POSTS (Feed)
router.get("/feed", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Get posts from users you follow + your own posts
    const posts = await Post.find({
      user: { $in: [...user.following, req.userId] },
    })
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    console.log("GET FEED ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE POST
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.log("GET POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET USER'S POSTS
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.log("GET USER POSTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE POST
router.put("/:id", auth, async (req, res) => {
  try {
    const { caption } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.caption = caption || post.caption;
    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "user",
      "username profilePic"
    );

    res.json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.log("UPDATE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE POST
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("DELETE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// LIKE/UNLIKE POST
router.put("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already liked
    const likeIndex = post.likes.indexOf(req.userId);

    if (likeIndex === -1) {
      // Like the post
      post.likes.push(req.userId);
    } else {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
      message: likeIndex === -1 ? "Post liked" : "Post unliked",
      likes: post.likes.length,
    });
  } catch (error) {
    console.log("LIKE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ADD COMMENT
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: req.userId,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic");

    res.status(201).json({
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.log("ADD COMMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE COMMENT
router.delete("/:postId/comment/:commentId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment or the post
    if (
      comment.user.toString() !== req.userId &&
      post.user.toString() !== req.userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("DELETE COMMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;