const express = require("express");
const router = express();
const {dataVerify} = require('../Auth/DataVerifyClass')
const {User} = require('../Auth/userClass')

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
