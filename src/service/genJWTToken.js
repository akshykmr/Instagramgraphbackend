const JWT = require('jsonwebtoken');
require('dotenv').config();
const SECUREKEY = process.env.JWTSECURE_KEY

function generateJWT(item) {
    return JWT.sign({ item }, SECUREKEY);
  };

  module.exports = generateJWT;