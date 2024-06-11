"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { User } = require("../Auth/classFile"); // Class user
router.post("/", User.login);
module.exports = router;
