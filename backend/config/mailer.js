const nodemailer = require("nodemailer");

let transporter;
const queue = [];

(async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    await transporter.verify();

    console.log("📬 Mailer ready (Ethereal test account)");
    console.log(`📧 Test email user: ${testAccount.user}`);
    console.log(`🔑 Test email pass: ${testAccount.pass}`);

    // Process emails that were requested before transporter was ready
    for (const args of queue) {
      sendInBackground(args);
    }

    queue.length = 0;
  } catch (e) {
    console.error("❌ Mailer setup error:", e);
  }
})();

function sendInBackground(args) {
  if (!transporter) {
    queue.push(args);
    return;
  }

  transporter
    .sendMail(...args)
    .then((info) => {
      console.log("📧 Email sent:", info.messageId);

      const previewUrl = nodemailer.getTestMessageUrl(info);

      if (previewUrl) {
        console.log("🔗 Email preview:", previewUrl);
      }
    })
    .catch((err) => {
      console.error("❌ Background email failed:", err);
    });
}

module.exports = {
  sendMail: (...args) => {
    sendInBackground(args);

    // Immediately resolve so controllers don't wait for email
    return Promise.resolve();
  },
};