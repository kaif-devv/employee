const express = require("express");
const router = express();
const {fileExists} = require("../Auth/dataVerify");
const {Crud} = require('../Auth/classFile');

router.get("/:id",fileExists, Crud.jwtVerification,Crud.search,);

module.exports = router;
