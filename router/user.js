const express = require("express");
const router = express.Router();
const {register,login,getUserDetails} = require("../controller/user");
const {auth,limiter} = require("../middleware/auth");



router.post("/register",register);

router.get("/getUserDetails",auth,limiter,getUserDetails);

router.post("/login",limiter,login);



module.exports = router;