"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express();
const { Crud } = require('../Auth/classFile');
router.delete("/delete/:id", Crud.fileExists, Crud.jwtVerification, Crud.deleteById);
module.exports = router;
