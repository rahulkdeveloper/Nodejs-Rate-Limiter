const { request, response } = require("express");
const express = require("express");
const app = express();
require("dotenv").config();
require("./db/config");

app.use(express.json());
app.use(express.urlencoded({extended:true}));




//using all routers.......
const refreshToken = require("./router/refreshToken");
const user = require("./router/user");

app.use("/user",user);
app.use("/refreshToken",refreshToken);






app.listen(process.env.PORT, async()=>{
    console.log("server is running");
})