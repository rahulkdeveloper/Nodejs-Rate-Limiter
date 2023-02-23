const express = require("express");
const router = express.Router();
const {loadUser,loadUserById,updateUser,createUser} = require("../controller/admin");
const {auth} = require("../middleware/auth");

router.get("/load-user",auth,loadUser);

router.get("/load-user-by-id",auth,loadUserById);

router.patch("/updateUser",auth,updateUser);

router.post("/create-user",auth,createUser);

module.exports = router;