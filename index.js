const { request, response } = require("express");
const express = require("express");
const app = express();
require("dotenv").config();
require("./db/config");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(function (request, response, next) {

    // Website you wish to allow to connect
    response.header('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    response.header('Access-Control-Allow-Credentials', true);
    response.header('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-type,x-csrf-token,Accept,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)

    // Pass to next layer of middleware
    next();
});


//using all routers.......
const authentication = require("./router/authentication");
const admin = require("./router/admin");

app.use("/auth",authentication);
app.use("/admin",admin);




app.listen(process.env.PORT, async()=>{
    console.log("server is running");
})