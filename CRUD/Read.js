const express = require("express");
const router = express();
const { fileExists } = require("../Auth/dataVerify");
const { Crud } = require("../Auth/classFile");


router.get("/read", fileExists, Crud.jwtVerification, Crud.read);

module.exports = router;
