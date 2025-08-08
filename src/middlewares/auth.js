const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const isValid = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const loggedUser = await User.findById(isValid?._id);

    if (!loggedUser) {
        throw new Error("User not found");
    }

    req.user = loggedUser;

    next();
  } catch (err) {
    res.status(400).send("ERROR: "+ err.message);
  }
};

module.exports = { userAuth };
