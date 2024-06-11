const express = require("express");
const router = express();
const {dataVerify,User} = require('../Auth/classFile')
router.post(
  "/create",
  dataVerify.fieldsVerify,
  dataVerify.passwordCheck,
  dataVerify.nameCheck,
  dataVerify.ageCheck,
  dataVerify.dptCheck,
  dataVerify.positionCheck,
  User.createEmployee
);

module.exports = router;
