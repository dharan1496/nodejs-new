const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { toUserId, status } = req.params;
    const { _id: fromUserId, firstName: fromUserFirstName } = req.user;

    const ALLOWED_STATUS = ["interested", "ignore"];
    if (!ALLOWED_STATUS.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status type", data: status });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyExist = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });
    if (alreadyExist) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: status === "interested" ? `You are ${status} in ${toUser.firstName}` : `You ignored ${toUser.firstName}`,
      data,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;
      const loggedInUser = req.user;

      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type", data: status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Invalid request",
        });
      }

    //   await ConnectionRequest.findByIdAndUpdate(requestId, { status });
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.send({
        message: `You have ${status} the connection request`,
        data
      });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
);

module.exports = router;
