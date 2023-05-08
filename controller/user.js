const { request, response } = require("express");
const User = require("../model/user");
require("dotenv").config();
const jwt  = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {pushChildToParent} = require("../helper/helper")
const validation = require("../helper/validate");

exports.register = async(request,response)=>{
    try {

        let {name,email,mobile,password ,confirmPassword,age, gender,isChild=false,isParent=false,parent} = request.body;
      
        let message = "Invalid details !"

        let isValidName = isValidEmail = isValidMobile = isValidPassword = isValidGender = true;

        if(!name || !email || !mobile || !password || !confirmPassword || !gender|| !age){
            return response.status(403).json({
                success:false,
                message:"all field required"
            })
        }

        if(name){
            isValidName = validation.name(name);
            isValidName? message : message +=" name"
        }

        if(email){
            isValidEmail = validation.email(email);
            isValidEmail? message : message +=" email"
        }

        if(mobile){
            isValidMobile = validation.mobile(mobile);
            isValidMobile? message : message +=" mobile"
        }

        if(password){
            isValidPassword = validation.password(password);
            isValidPassword? message : message +=" password"
        }

        if(gender){
            
            isValidGender = validation.gender(gender);
            isValidGender? message : message +=" gender"
        }

        if(!isValidName || !isValidEmail || !isValidMobile || !isValidPassword || !isValidGender){
            return response.json({
                success:false,
                message:message
            })
        }


     


     

        if(password && confirmPassword){
            if(password !== confirmPassword){
                return response.json({
                    success:false,
                    message:"password is not matched with confirm password"
                })
            }
        }

        if(isChild){
            if(!parent){
                return response.json({
                    success:false,
                    message:"parent details required"
                })
            }
            let parentFind = await User.findOne({_id:parent,isParent:true}).lean();
            if(!parentFind){
                return response.status(404).json({
                    success:false,
                    message:"parent details not found"
                })
            }

        }

       

        // password encrption//

        let salt = await bcrypt.genSaltSync(10);
        let hashPassword = await bcrypt.hashSync(password,salt);
        
        const userRegister = new User({
            name: name,
            email: email,
            mobile: mobile,
            password: hashPassword,
            age,
            isChild,
            isParent
        })

        if(isChild){
            userRegister["parents"] = parent
        }

    
        


        
        const result = await userRegister.save()

        if(!result){
            return response.json({
                success:false,
                message:"internal server error"
            })
        }

        if(isChild){
            await pushChildToParent(result._id,parent)
        }


        return response.json({
            success:true,
            message:"register successfully",
            data:result,
        })

    } catch (error) {
        console.log("error",error)
        
        return response.json({
            success:false,
            message:error.message
        })
    }
}

exports.getUserDetails = async (request,response)=>{
    try {

        let userData = request.userData;

        let userFound = await User.find({_id:userData._id}).populate("childs").populate("parents").lean();

        if(!userFound){
            return response.status(404).json({
                success:false,
                message:"user not found",
               
            })
        }

        return response.status(200).json({
            success:true,
            message:"success",
            data:userFound
        })



        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.login = async(request,response)=>{
    try {

        let {email,password} = request.body;
        
        let userFound = await User.findOne({email}).lean();

        if(!userFound){
            return response.json({
                success:false,
                message:"wrong email"
            })
        }

        //verify password............
        
        let hashPassword = await bcrypt.compareSync(password,userFound.password);
        
        if (!hashPassword) {
            return response.json({
                success:false,
                message:"wrong password"
            })
        }

 

        const token = await jwt.sign({_id:userFound._id.toString()},process.env.JWT_SECRET,{expiresIn:"1m"});

        const refreshToken = await jwt.sign({_id:userFound._id.toString()},process.env.JWT_SECRET,{expiresIn:"1m"});

        if(!token){
            return response.status(500).json({
                success:false,
                message:"internal server error"
            })
        }

       
        
        
     

    

        return response.json({
            success:true,
            message:"login successfully",
            token:token,
            refreshToken
        })

    } catch (error) {
        console.log(error)
        return response.json({
            success:false,
            message:error.message
        })
    }
}