const nodemailer = require("nodemailer");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");

const sendMail = async (mailAddress, subject, body) => {
  const senderMail = process.env.EMAIL_USERNAME;
  const senderPassword = process.env.EMAIL_PASSWORD;

  console.log(senderMail);
  console.log(senderPassword);

  const mailOptions = {
    from: senderMail,
    to: mailAddress,
    subject: subject,
    replyTo: senderMail,
    html: body,
  };

  console.log("I am in mail service");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: senderMail,
      pass: senderPassword,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.log("Failed to send email", error);
    return false;
  }
};

module.exports = {
  sendMail,
};
