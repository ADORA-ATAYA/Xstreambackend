const admin = require("firebase-admin");
require("dotenv").config();
// const serviceAccount = require("./firebaseAdminKey.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;



