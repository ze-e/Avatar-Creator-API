const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transport object using Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port:587,
  auth: {
    user: process.env.NODEMAILER_MAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

exports.sendMail = async ({ to, subject, text }) => {
  // Send an email with the token link
  const mailOptions = {
    from: process.env.NODEMAILER_MAIL,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
};
