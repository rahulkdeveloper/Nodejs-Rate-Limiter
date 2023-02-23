const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 
    email:{
        type:String,
        require:true,
        unique:true
    },
    password : {
        type: String
    },
    salt:{
        type:String
    },
    status:{
        type:String,
        default:"unCompleted",
    }
    
})

const user = mongoose.model("user",userSchema);

module.exports = user