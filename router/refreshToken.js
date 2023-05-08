const express = require("express");
const router = express.Router();
const {refreshToken} = require("../controller/refreshToken");
const {limiter} = require("../middleware/auth");

router.post("/refreshToken",limiter,refreshToken);

module.exports = router;