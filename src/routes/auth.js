const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validator = require("validator");
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const userObj = req.body;
        const { password } = userObj;

        userObj.password = await bcrypt.hash(password, 10);

        const user = new User(userObj);

        await user.save();

        res.send({ message: "User created successfully!" });
    } catch(err) {
        res.status(500).send({
            error: "Internal Server Error",
            message: err.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid email format");
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials!");
        }

        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            throw new Error("Invalid credentials!");
        }
        
        const token = user.getJWT();
        res.cookie('token', token, { expires: new Date(Date.now() + (8 * 360000)) }).send({ message: "Login successful!" });
    } catch(err) {
        res.status(500).send('ERROR:' + err.message);
    }
})


router.post("/logout", (req, res) => {
   res.cookie('token', null, { expires: new Date(Date.now()) }).send({ message: "Logged out successfully!" });
})

module.exports = router;