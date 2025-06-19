const admin = require("firebase-admin");
const svc = require("./firebase-service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(svc),
  storageBucket: process.env.FIREBASE_BUCKET,
});
module.exports = admin.storage().bucket();
