const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const bcrypt = require("bcrypt");
const { generateToken } = require("../Auth/generateToken");

router.post("/", (req, res) => {
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  const empJSON = require(jsonFilePath);
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
});
module.exports = router;
