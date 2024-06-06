const express = require("express");
const router = express();
const { fileExists } = require("../Auth/dataVerify");
const {Crud} = require('../Auth/classFile');

//Display all employees
router.get("/all", fileExists, Crud.jwtVerification,Crud.getAll);

//Display paginated employees

router.get("/all/:id", fileExists, Crud.jwtVerification,Crud.getPaginated);

module.exports = router;
