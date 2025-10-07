const nodemailer = require("nodemailer");

let transporter;
const queue = [];

(async () => {
  try {
    // Create a test account
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

    for (const { args, resolve, reject } of queue) {
      transporter
        .sendMail(...args)
        .then(resolve)
        .catch(reject);
    }
  } catch (e) {
    console.error("❌ Mailer setup error:", e);
  }
})();

module.exports = {
  sendMail: async (...args) => {
    if (transporter) return transporter.sendMail(...args);
    return new Promise((resolve, reject) =>
      queue.push({ args, resolve, reject })
    );
  },
};
