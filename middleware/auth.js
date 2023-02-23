const { request, response } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/user");

exports.auth = async(request,response,next)=>{
    try {

        let token = request.headers.authorization;

       

        if(!token){
            return response.status(403).json({
                success:false,
                message:"Acccess Denied"
            })
        }

        let res = await jwt.verify(token,process.env.SECRETCODE);

       

        if(!res){
            return response.status(403).json({
                success:false,
                message:"Acccess Denied"
            })
        }

        let userFound = await User.findOne({_id:res}).lean();

        if(!userFound){
            return response.status(403).json({
                success:false,
                message:"Acccess Denied"
            })
        }

        if(userFound.email != process.env.ADMIN_EMAIL){
            return response.status(403).json({
                success:false,
                message:"Acccess Denied"
            })
        }

        next()
        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}


