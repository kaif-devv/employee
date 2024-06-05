const express = require("express");
const router = express();
const {fileExists} = require("../Auth/dataVerify");
const {empJson} = require("../Auth/FunctionCalls");
const { jwtVerify } = require("../Auth/verifyToken");

function jwtVerification(req, res, next) {
  const token = req.header("jwt_key");
  try {
    jwtVerify(token);
    next();
  } catch (error) {
    res.send("Invalid user");
  }
}

function search(req,res,next){
  const empJSON = empJson()
  const id = parseInt(req.params.id);
  const e = empJSON.find((elem) => elem.id === id);
  if (!e) res.send("Employee not found");
  else {
    res.send(e);
  }
}

router.get("/:id",fileExists, jwtVerification,search,);

module.exports = router;
