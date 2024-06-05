const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { generateToken } = require("../Auth/generateToken");
const {empJson} = require("../Auth/FunctionCalls");

function login(req,res,next){
  const empJSON = empJson()
  const { email, password } = req.body;
  const employee = empJSON.find((ele) => ele.email === email);
  if (!employee) res.send("Invalid Credentials or Employee doesn't exist");
  bcrypt.compare(password, employee.password, async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    if (!result) {
      return res.send("Your password is incorrect");
    }
    const payload = {
      email: email,
      isAdmin: true,
    };
    const token = generateToken(payload);
    res.append("jwt_key", token);
    res.send("Login successful , token generated is " + token);
  });
}

router.post("/", login);

module.exports = router;
