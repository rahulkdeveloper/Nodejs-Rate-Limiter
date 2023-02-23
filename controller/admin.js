const { request, response } = require("express");
const User = require("../model/user");
require("dotenv").config();
const jwt  = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.loadUser = async (request,response)=>{
    try {

        let {searchKey , limit , skip} = request.query;

        

        let regex = {$regex:searchKey, $options:"$i"};

        let search = {
            $or:[
                {"email":regex},
                {"status":regex}
            ]
        }

        let Query = {
            ...{email:{$ne:process.env.ADMIN_EMAIL}},
            ...(searchKey && search)
        }

        let userFound = await User.find(Query).lean();

        if(userFound.length<1){
            return response.status(400).json({
                success:false,
                message:"user not found"
            })
        }

        // pagination.........
        limit = limit || 10;
        skip = skip ?? 0

        let total = userFound.length;

        

        userFound = userFound.slice(+skip,(+limit)+(+skip));

        return response.status(200).json({
            success:true,
            message:"success",
            data:userFound,
            total
        })



        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.loadUserById = async (request,response)=>{
    try {

        let {user} = request.query;

        let userFound = await User.find({_id:user}).lean();

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

exports.updateUser = async (request,response)=>{
    try {

        let {user,status} = request.body;

        let userUpdate = await User.findOneAndUpdate({_id:user},{status:status},{new:true}).lean();

        if(!userUpdate){
            return response.status(404).json({
                success:false,
                message:"user not found",
               
            })
        }

        return response.status(200).json({
            success:true,
            message:"update successfully",
            data:userUpdate
        })



        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.createUser = async (request,response)=>{
    try {

        let {email,password} = request.body;

        if(!email || !password){
            return response.status(403).json({
                success:false,
                message:"Invalid Detail provided"
            })
        }

        let userExist = await User.findOne({email:email}).lean();

        console.log("userExist",userExist)

        if(userExist){
            return response.status(404).json({
                success:false,
                message:"user exist with this email",
               
            })
        }

        else{

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

            return response.status(200).json({
                success:true,
                message:"user created successfully",
                data:saveUser
            })
        }



        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}