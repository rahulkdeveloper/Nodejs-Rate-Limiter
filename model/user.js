const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
     
    },
 
    mobile:{
        type: String,
        require: true,
    
    },
    age:{
        type: String,
        require: true
    },
    gender:{
        type : String,
        enum:["male","female","transgender"],
        default:"male",
        require:true
    },

    password:{
        type:String
    },
    isChild:{
        type:Boolean
    },
    isParent:{
        type:Boolean
    },
    childs:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user'
    }],
    parents:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user'
    }],
    registerOn:{
        type:Date,
        default:Date.now()
    },

})



const user = new mongoose.model("user", userSchema)

module.exports = user

