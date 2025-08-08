const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Invalid email format");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(password) {
            if (!validator.isStrongPassword(password)) {
                throw new Error("Password is not strong");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        lowercase: true,
        enum: {
            values: ['male', 'female', "others"],
            message: '{VALUE} is invalid gender'
        },
        // validate(value) {
        //     if (!['male', 'female', 'others'].includes(value)) {
        //         throw new Error('Invalid value');
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
        validate(url) {
            if (!validator.isURL(url)) {
                throw new Error("Invalid URL format");
            }
        }
    },
    about: {
        type: String,
        default: "Hello! I am using DevTinder.",
    },
    skills: {
        type: [String],
        validate(skills) {
            if (skills.length > 10) {
                throw new Error("Maximum 10 skills allowed");
            }
        }
    },
}, {
    timestamps: true,
    methods: {
         getJWT() {
            const user = this;
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
            return token;
        },
        async validatePassword(password) {
            const user = this;
            const passwordHash = user.password;
            const isMatch = await bcrypt.compare(password, passwordHash);
            return isMatch;
        }
    }
});

const User = mongoose.model("User", userSchema);


module.exports = User;