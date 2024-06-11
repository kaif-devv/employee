"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express();
const { Crud } = require("../Auth/classFile");
router.get("/read", Crud.fileExists, Crud.jwtVerification, Crud.read);
module.exports = router;
