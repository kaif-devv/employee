const express = require("express");
const fs = require("fs");
const router = express();
const path = require("path");
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

router.delete("/delete/:id",jwtVerification, (req, res) => {
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Invalid id number or data doesn't exists");
  } else {
    const empJSON = require(jsonFilePath);
    const id = parseInt(req.params.id);
    const index = empJSON.findIndex((elem) => elem.id === id);
    if (index === -1) res.send("Employee not found");
    else {
      empJSON.splice(index, 1);
      fs.writeFileSync("./DATA/myFiles.json", JSON.stringify(empJSON));
      res.send("Employee deleted successfully");
    }
  }
});

module.exports = router;
