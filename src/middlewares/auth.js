const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Unauthorized");
    }

    const isValid = jwt.verify(token, "dharan1496@");

    const loggedUser = await User.findById(isValid?._id);

    if (!loggedUser) {
        throw new Error("User not found");
    }

    req.user = loggedUser;

    next();
  } catch (err) {
    res.status(401).send("ERROR: "+ err.message);
  }
};

module.exports = { userAuth };
