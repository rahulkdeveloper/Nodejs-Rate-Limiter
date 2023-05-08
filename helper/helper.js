const User = require("../model/user");
const jwt  = require("jsonwebtoken");
require("dotenv").config();

exports.generateToken = async(userId,secerateCode,time)=>{
    let token  = await jwt.sign({_id:userId.toString()},process.env.JWT_SECRET,{expiresIn:time});
    return token
}

exports.pushChildToParent = async(childId,parentId)=>{
   

    let updateParent = await User.findOneAndUpdate({_id:parentId},{$push:{childs:childId}});
    return 

}