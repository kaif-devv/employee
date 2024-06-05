const express = require("express");
const router = express();
const path = require("path");
const fs = require("fs");
const {empJson } = require('../Auth/FunctionCalls')
const { jwtVerify } = require("../Auth/verifyToken");
const { fileExists } = require("../Auth/dataVerify");

function jwtVerification(req, res, next) {
  const token = req.header("jwt_key");
  try {
    jwtVerify(token);
    next();
  } catch (error) {
    res.send("Invalid user");
  }
}
//Display all employees
router.get("/all", fileExists, jwtVerification, (req, res) => {
  const empJSON = empJson()
  if (empJSON) res.json(empJSON);
  else {
    res.send("Employee list empty");
  }
});

// paginated employees

router.get("/all/:id", fileExists, jwtVerification, (req, res) => {
  const id = parseInt(req.params.id);
  const empJSON = empJson()
  if (empJSON) {
    //pagination for 4 employees
    const start = (id - 1) * 4;
    const end = id * 4;
    const result = empJSON.slice(start, end);
    res.json(result);
  } else {
    res.send("Employee list empty");
  }
});

module.exports = router;
