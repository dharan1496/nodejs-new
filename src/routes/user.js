const express = require("express");

const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const ALLOWED_FIELDS = "firstName lastName gender age photoUrl skills";

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", ALLOWED_FIELDS);
    res.send({ message: "Data fetched successfully", data: pendingRequests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser?._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser?._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", ALLOWED_FIELDS)
      .populate("toUserId", ALLOWED_FIELDS);

    const formattedConnection = connections.map((connection) => {
      if (connection.fromUserId?._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    res.json({ data: formattedConnection });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { limit = 10, page = 1 } = req.query;
    if (limit > 50) {
        return res.status(400).json({
            message: "Limit cannot be more than 50",
        });
    }

    const skip = (page - 1) * limit;

    const relatedRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const requestIds = new Set();
    relatedRequests.forEach((request) => {
      requestIds.add(request.toUserId._id);
      requestIds.add(request.fromUserId._id);
    });

    const feeds = await User.find({
      $and: [
        { _id: { $nin: [...requestIds] } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .skip(skip)
      .limit(limit);
    res.json({ data: feeds });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
