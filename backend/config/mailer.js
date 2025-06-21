// mailer.js
const nodemailer = require("nodemailer");

let transporter;

const queue = [];

(async () => {
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Set to true if using port 465
    auth: {
      user: process.env.COOP_EMAIL,
      pass: process.env.COOP_PASSWORD,
    },
  });

  // Optional: test the transporter on start
  try {
    await transporter.verify();
    console.log("✅ Mailer is ready (Ethereal via .env)");
  } catch (err) {
    console.error("❌ Mailer config error:", err);
  }

  // Flush any queued emails
  for (const { args, resolve, reject } of queue) {
    transporter
      .sendMail(...args)
      .then(resolve)
      .catch(reject);
  }
})();

// Export like real nodemailer transporter
module.exports = {
  sendMail: async (...args) => {
    if (transporter) {
      return transporter.sendMail(...args);
    }
    return new Promise((resolve, reject) => {
      queue.push({ args, resolve, reject });
    });
  },
};
