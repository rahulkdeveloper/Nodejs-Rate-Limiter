const express = require("express");
const router = express.Router();
const {loginAndSignup} = require("../controller/authentication");

router.post("/login",loginAndSignup);

module.exports = router;