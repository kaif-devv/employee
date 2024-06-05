const express = require("express");
const router = express();
const {fileExists} = require("../Auth/dataVerify");
const {empJson} = require("../Auth/FunctionCalls");
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

function read(req,res,next){
  const empJSON= empJson();
  const name = req.query.name;
  const employ = empJSON.filter((elem) => elem.name === name);
  if (employ.length === 0) res.send("employee not found");
  res.json(employ);
}

router.get("/read",fileExists,jwtVerification,read);

module.exports = router;


