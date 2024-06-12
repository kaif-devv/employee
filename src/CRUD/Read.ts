const express = require("express");
const router = express();
const { Crud } = require("../Auth/CrudClass");

router.get("/read", Crud.fileExists, Crud.jwtVerification, Crud.read);

module.exports = router;
