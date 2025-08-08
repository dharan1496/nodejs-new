const { sesClient } = require("./sesClient");
const { SendEmailCommand } = require("@aws-sdk/client-ses");

const createSendEmailCommand = (toEmail, subject, message) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>${message}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "request@devtinder.ink",
    ReplyToAddresses: [],
  });
};

const sendEmail = async (toEmail, subject, message) => {
  const sendEmailCommand = createSendEmailCommand(
    toEmail,
    subject,
    message
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { sendEmail };
