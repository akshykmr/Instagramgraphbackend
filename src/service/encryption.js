require("dotenv").config();
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
// Function to encrypt and save data in the database
async function encryptedData(inputString) {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), crypto.randomBytes(16));
    let encryptedData = cipher.update(inputString, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    return encryptedData

  } catch (error) {
    console.error('Error saving encrypted data:', error);
  }
}

module.exports = encryptedData;
