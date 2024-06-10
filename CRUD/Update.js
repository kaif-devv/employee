const express = require("express");
const router = express();
const { dataVerify, User, Crud } = require("../Auth/classFile");

router.put(
  "/update/:id",
  Crud.fileExists,
  Crud.jwtVerification,
  dataVerify.nameCheck,
  dataVerify.passwordCheck,
  dataVerify.ageCheck,
  dataVerify.dptCheck,
  dataVerify.positionCheck,
  dataVerify.performanceVerify,
  User.updateEmployee,
  (req, res) => {
    res.send("Employee details updated successfully ");
  }
);

module.exports = router;
