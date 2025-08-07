const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      required: true,
    },
  },
  {
    timestamps: true
  }
);

// compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Before save, pre will be called
connectionRequestSchema.pre("save", function (next) {
    const request = this;
    if (request.fromUserId.equals(request.toUserId)) {
        return next(new Error("You cannot send a connection request to yourself"));
    }
    next();
});


const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
