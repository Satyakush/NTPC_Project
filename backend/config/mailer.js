const nodemailer = require("nodemailer");
const t = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
module.exports = (opts) => t.sendMail({ from: process.env.SMTP_USER, ...opts });
