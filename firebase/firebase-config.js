const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
serviceAccount.private_key_id = process.env.FIREBASE_PRIVATE_KEY_ID


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log()

module.exports={
    admin
}