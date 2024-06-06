const express = require("express");
const router = express();
const {Crud} = require('../Auth/classFile');

const {fileExists} = require("../Auth/dataVerify");

router.delete("/delete/:id", fileExists, Crud.jwtVerification,Crud.deleteById);

module.exports = router;
