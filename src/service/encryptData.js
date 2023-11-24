const crypto = require('crypto');
require("dotenv").config();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
const rounds = 9921;
const keySize = 32;
const algorithm = 'aes-256-cbc';
const salt = crypto.createHash('sha1').update(ENCRYPTION_KEY).digest("hex");


function encryptData(data) {
    try {
    let iv = crypto.randomBytes(16);
    let key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, rounds, keySize, 'sha512');
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encryptedData = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
    return iv.toString('base64') + ':' + encryptedData.toString('base64');
    }
    catch (err) {
    console.error(err)
    return false;
    }
    }
    
    module.exports = encryptData;