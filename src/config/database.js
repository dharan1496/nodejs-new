const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dharan:rFUv5JBx95v04oK9@practice.sgpo2ls.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
