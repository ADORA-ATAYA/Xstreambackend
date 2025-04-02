const mongoose = require('mongoose')


//define schema (field)
const UserSchema = new mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true
    },
    roomcodes:{
        type:[String],
        default: [] ,
    }
},{timestamps:true})

//create collection
const UserModel = mongoose.model('user',UserSchema)  

module.exports = UserModel