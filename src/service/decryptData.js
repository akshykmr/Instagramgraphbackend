const crypto = require('crypto');
require("dotenv").config();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
const rounds = 9921;
const keySize = 32;
const algorithm = "aes-256-cbc";
const salt = crypto.createHash("sha1").update(ENCRYPTION_KEY).digest("hex");



function decryptData(encData) {
  try {
    let textParts = encData.split(":");
    let iv = Buffer.from(textParts.shift(), "base64");
    let encryptedData = Buffer.from(textParts.join(":"), "base64");
    let key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, rounds, keySize, "sha512");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
    return JSON.parse(decryptedData.toString());
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = decryptData;
