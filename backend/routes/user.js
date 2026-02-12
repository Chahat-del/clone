const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// GET USER PROFILE
router.get("/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("GET USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET CURRENT USER
router.get("/me/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("GET CURRENT USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE USER PROFILE
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, bio, profilePic } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    user.username = username || user.username;
    user.bio = bio !== undefined ? bio : user.bio;
    user.profilePic = profilePic !== undefined ? profilePic : user.profilePic;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// FOLLOW USER
router.put("/:userId/follow", auth, async (req, res) => {
  try {
    // Can't follow yourself
    if (req.params.userId === req.userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following
    currentUser.following.push(req.params.userId);
    await currentUser.save();

    // Add to followers
    userToFollow.followers.push(req.userId);
    await userToFollow.save();

    res.json({ message: "User followed successfully" });
  } catch (error) {
    console.log("FOLLOW USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// UNFOLLOW USER
router.put("/:userId/unfollow", auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.userId
    );
    await currentUser.save();

    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.userId
    );
    await userToUnfollow.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.log("UNFOLLOW USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET FOLLOWERS
router.get("/:userId/followers", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "followers",
      "username profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.followers);
  } catch (error) {
    console.log("GET FOLLOWERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET FOLLOWING
router.get("/:userId/following", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "following",
      "username profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.following);
  } catch (error) {
    console.log("GET FOLLOWING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// SEARCH USERS
router.get("/search/:query", auth, async (req, res) => {
  try {
    const users = await User.find({
      username: { $regex: req.params.query, $options: "i" },
    })
      .select("username profilePic bio")
      .limit(20);

    res.json(users);
  } catch (error) {
    console.log("SEARCH USERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;