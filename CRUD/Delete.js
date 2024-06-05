const express = require("express");
const fs = require("fs");
const router = express();
const { jwtVerify } = require("../Auth/verifyToken");

const {fileExists} = require("../Auth/dataVerify");

function jwtVerification(req, res, next) {
  const token = req.header("jwt_key");
  try {
    jwtVerify(token);
    next();
  } catch (error) {
    res.send("Invalid user");
  }
}

function deleteById(req,res,next){
  const {empJson} = require("../Auth/FunctionCalls");
  const empJSON = empJson();
  const id = parseInt(req.params.id);
  const index = empJSON.findIndex((elem) => elem.id === id);
  if (index === -1) res.send("Employee not found");
  else {
    empJSON.splice(index, 1);
    fs.writeFileSync("./DATA/myFiles.json", JSON.stringify(empJSON));
    res.send("Employee deleted successfully");
  }
}

router.delete("/delete/:id", fileExists, jwtVerification,deleteById, (req, res) => {

});

module.exports = router;
