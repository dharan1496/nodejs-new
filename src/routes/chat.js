const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

router.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const { _id: userId } = req.user;
    let chat = await Chat.findOne({
      participants: {
        $all: [userId, targetUserId],
      },
    }).populate({
        path: "messages.senderId",
        select: "firstName lastName"
    })
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json({ chat });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
