const express = require("express");
const router = express();
const path = require("path");
const fs = require('fs');
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
router.get("/:id", jwtVerification, (req, res) => {
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exist");
  }
  const empJSON = require(jsonFilePath);
  const id = parseInt(req.params.id);
  const e = empJSON.find((elem) => elem.id === id);
  if (!e) res.send("Employee not found");
  else {
    res.send(e);
  }
});

module.exports = router;
