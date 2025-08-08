require("dotenv").config();

const express = require('express');
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth")
const requestsRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const cors = require("cors");
require("./utils/cronJob");

const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use("/", requestsRouter);
app.use("/", profileRouter)
app.use("/", authRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed");
  });


