const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.COOP_EMAIL,
    pass: process.env.COOP_EMAIL_PASSWORD,
  },
});

module.exports = transporter;
