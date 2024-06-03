const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

function generateToken(payload) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, jwtSecretKey);
  return token;
}

module.exports = { generateToken };
