const express = require('express');

const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateProfileData } = require("../utils/validator");
const bcrypt = require("bcrypt");
const validator = require('validator');


router.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      res.status(500).send("ERROR:" + err.message);
    }
  });

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
        throw new Error("Invalid profile data");
    }
    const body = req.body;
    const loggedInUser = req.user;
    // const updatedUser = await User.findOneAndUpdate(loggedInUser?._id, body, {
    //   runValidators: true,
    //   returnDocument: 'after'
    // });
    // req.user = updatedUser;

    Object.keys(body).forEach((key) => loggedInUser[key] = body[key]);

    await loggedInUser.save()

    // res.send("User updated successfully!");
    res.json({
        message: `${loggedInUser.firstName}, Profile is updated succesfully`,
        data: loggedInUser
    })
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
      message: err.message,
    });
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    // validating new password
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not strong enough");
    }

    const loggedInUser = req.user;

    // comparing old & new password
    const isSame = await bcrypt.compare(newPassword, loggedInUser.password);
    if (isSame) {
      throw new Error("New password cannot be same as old password");
    }

    // hashing new password
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newHashPassword;

    await loggedInUser.save();

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


module.exports = router;