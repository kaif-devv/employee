"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express();
const { dataVerify, User, Crud, Jwt } = require("../Auth/classFile");
router.put("/update/:id", Crud.fileExists, Crud.jwtVerification, dataVerify.nameCheck, dataVerify.passwordCheck, dataVerify.ageCheck, dataVerify.dptCheck, dataVerify.positionCheck, dataVerify.performanceVerify, User.updateEmployee);
module.exports = router;
