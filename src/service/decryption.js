require("dotenv").config();
const crypto = require("crypto");

const KEY = process.env.ENCRYPTION_KEY;

const ENCRYPTION_KEY = Buffer.from(KEY, 'utf8');

async function retrieveDecryptedData(encryptedId) {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      crypto.randomBytes(16)
    );
    let decryptedData = decipher.update(encryptedId, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
  } catch (error) {
    console.error("Error retrieving decrypted data:", error);
  }
}

module.exports = retrieveDecryptedData;
