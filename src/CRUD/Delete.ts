const express = require("express");
const router = express();
const {Crud} = require('../Auth/CrudClass');

router.delete("/delete/:id", Crud.fileExists, Crud.jwtVerification,Crud.deleteById);

module.exports = router;
