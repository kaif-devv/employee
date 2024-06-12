const express = require("express");
const router = express.Router();
const { User } = require("../Auth/userClass"); // Class user

router.post("/", User.login);

module.exports = router;
