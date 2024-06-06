const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

function jwtVerify(token) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  const verify = jwt.verify(token, jwtSecretKey);
  return verify;
}

module.exports = { jwtVerify };


