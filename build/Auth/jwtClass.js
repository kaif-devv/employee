"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
class Jwt {
    //Verifying the Token
    static jwtVerify(token) {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const verify = jwt.verify(token, jwtSecretKey);
        return verify;
    }
    //Generating the Token
    static generateToken(payload) {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(payload, jwtSecretKey);
        return token;
    }
}
module.exports = { Jwt };
