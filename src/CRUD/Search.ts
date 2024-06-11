const express = require("express");
const router = express();
const {Crud} = require('../Auth/classFile');

router.get("/:id",Crud.fileExists, Crud.jwtVerification,Crud.search,);

module.exports = router;
