"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express();
const { Crud } = require('../Auth/classFile');
//Display all employees
router.get("/all", Crud.fileExists, Crud.jwtVerification, Crud.getAll);
//Display paginated employees
router.get("/all/:id", Crud.fileExists, Crud.jwtVerification, Crud.getPaginated);
module.exports = router;
