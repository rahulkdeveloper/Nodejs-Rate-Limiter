const { request, response } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/user");
const rateLimit = require("express-rate-limit");

exports.auth = async(request,response,next)=>{
    try {

        let token = request.headers.authorization;

       

        if(!token){
            return response.status(403).json({
                success:false,
                message:"Acccess Denied"
            })
        }

        let res = await jwt.verify(token,process.env.JWT_SECRET);
        
        
        if(!res){
            return response.status(403).json({
                success:false,
                message:"Acccess Denied"
            })
        }

        let userFound = await User.findOne({_id:res._id}).lean();

        if(!userFound){
            return response.status(403).json({
                success:false,
                message:"Acccess Denied"
            })
        }
       

        request.userData = userFound;

        

        next()
        
    } catch (error) {
      
        return response.status(500).json({
            success:false,
            message:"please login"
        })
    }
}



exports.limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 10,
	standardHeaders: true, 
	legacyHeaders: false, 
})



