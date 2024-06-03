const express = require("express");
const router = express();
const path = require("path");
const fs = require('fs')

const {jwtVerify} = require('../Auth/verifyToken');
function jwtVerification(req, res, next) {
  const token = req.header("jwt_key");
  try {
    jwtVerify(token);
    next();
  } catch (error) {
    res.send("Invalid user");
  }
}

router.get("/read",jwtVerification, (req, res) => {
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists")
  }
  const empJSON= require(jsonFilePath)
  const name = req.query.name;
  const employ = empJSON.filter((elem) => elem.name == name);
  if (employ.length === 0) res.send("employee not found");
  res.json(employ);
});

module.exports = router;


