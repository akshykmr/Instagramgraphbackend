require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWTSECURE_KEY = process.env.JWTSECURE_KEY;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const decoded = jwt.verify(authHeader, JWTSECURE_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
module.exports = { verifyToken };