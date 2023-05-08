const {generateToken} = require("../helper/helper")
require("dotenv").config();
const jwt  = require("jsonwebtoken");


async function verifyRefresh(userId, token) {
    try {
        console.log("ueyeui")
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     console.log("decoded")
     return decoded._id === userId;
    } catch (error) {
     // console.error(error);
     return false;
    }
   }


exports.refreshToken = async (request,response)=>{
    try {

        let {refreshToken,userId} = request.body;
        

        let isValid = await verifyRefresh(userId,refreshToken)

        if(!isValid){
            return response.status(404).json({
                success:false,
                message:"plese login",
               
            })
        }

        let accessToken = await generateToken(userId,process.env.JWT_SECRET,"1m")

        return response.status(200).json({
            success:true,
            message:"success",
            accessToken:accessToken
        })



        
    } catch (error) {
        console.log("error",error);
        return response.status(500).json({
            success:false,
            message:error.message
        })
    }
}