const { request, response } = require("express");
const jwt  = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");

exports.loginAndSignup = async(request,response)=>{
    try {

        let {email,password} = request.body;

        if(!email || !password){
            return response.status(403).json({
                success:false,
                message:"Invalid Detail provided"
            })
        }

        // check email exist or not ..........
        let existUser = await User.findOne({email}).lean();
        if(existUser){

            // password validation.......
            
            let compare = await bcrypt.compare(password,existUser.password);

            if(!compare){
                return response.status(403).json({
                    success:false,
                    message:"Wrong password"
                })
            }

            // generate jwt token...........
            let token = await jwt.sign((existUser._id).toString(),process.env.SECRETCODE);

            if(token){
                return response.status(200).json({
                    success:true,
                    message:"successfully login",
                    sessionId:token,
                    data:existUser
                })
            }
            else{
                return response.status(500).json({
                    success:false,
                    message:"Internal server error"
                })
            }


        }
        else{
            // create new user......

            // 1. create hash password...........
        
            let salt = await bcrypt.genSalt(10);
            let hashPassword = await bcrypt.hash(password,salt);

            let newUser = await User({
                email,
                password:hashPassword,
                salt
            })

            let saveUser = await newUser.save();

            if(!saveUser){
                return response.status(500).json({
                    success:false,
                    message:"Internal server error"
                })
            }

            // generate jwt token...........
            let token = await jwt.sign((saveUser._id).toString(),process.env.SECRETCODE);

            if(token){
                return response.status(200).json({
                    success:true,
                    message:"successfully register",
                    sessionId:token,
                    data:saveUser
                })
            }
            else{
                return response.status(500).json({
                    success:false,
                    message:"Internal server error"
                })
            }
        }
        

        
        
        
        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}
