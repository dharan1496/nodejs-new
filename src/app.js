const express = require('express');
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth")
const requestsRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json())
app.use(cookieParser());
app.use("/", requestsRouter);
app.use("/", profileRouter)
app.use("/", authRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed");
  });


