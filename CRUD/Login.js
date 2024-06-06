const express = require("express");
const router = express.Router();
const { user } = require("../Auth/classFile"); // Class of JWT and API
router.post("/", user.login);

module.exports = router;
