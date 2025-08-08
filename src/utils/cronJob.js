const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { sendEmail } = require("./sendEmail");

// Runs at every day 9 am
cron.schedule("0 9 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: startOfDay(yesterday),
        $lt: endOfDay(yesterday),
      },
    }).populate("toUserId fromUserId", "firstName lastName emailId");

    const emailIds = [
      ...new Set(pendingRequests.map((request) => request?.toUserId.emailId)),
    ];

    emailIds.forEach(async (id) => {
      try {
        await sendEmail(
          id,
          "Pending New Connection Requests",
          "Hello, <br/><br/>Please login to <a href='https://devtinder.ink' target='_blank'>DevTinder</a> to accept or reject the pending requests.<br/><br/>Thanks"
        );
      } catch (error) {
        console.log(error);
      }
    });
  } catch (err) {
    console.error(err);
  }
});
