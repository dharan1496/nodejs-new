const validator = require("validator");

const validateProfileData = (req) => {
    const body = req.body;
    const ALLOWED_EDIT_FIELDS = ["firstName", "lastName", "emailId", "gender", "age", "skills", "about", "photoUrl"];
    const isAllowed = Object.keys(body).every((key) => ALLOWED_EDIT_FIELDS.includes(key));
    return isAllowed;
}

module.exports = { validateProfileData };