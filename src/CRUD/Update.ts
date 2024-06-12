const express = require("express");
const router = express();
const { dataVerify  } = require("../Auth/DataVerifyClass");
const {  User } = require("../Auth/userClass");
const {  Crud } = require("../Auth/CrudClass");


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
  User.updateEmployee
);

module.exports = router;
