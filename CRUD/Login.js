const express = require("express");
const router = express.Router();
const { user } = require("../Auth/classFile"); // Class user
router.post("/", user.login);

module.exports = router;
