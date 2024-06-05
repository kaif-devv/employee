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

router.get("/all",jwtVerification, (req, res) => {
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists")
  } else{
  const empJSON = require(jsonFilePath);

  if (empJSON) res.json(empJSON);
  else {
    res.send("Employee list empty");
  }}
});

// paginated employees

router.get("/all/:id",jwtVerification, (req, res) => {
  const id = parseInt(req.params.id);
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists")
  } else{
  const empJSON = require(jsonFilePath);
  console.log(id);

  if (empJSON) {
    //pagination for 4 employees
    const start = (id - 1) * 4;
    const end = id * 4;
    const result = empJSON.slice(start, end);
    res.json(result);
  } 
  else {
    res.send("Employee list empty");
  }}
});

module.exports = router;
