const mongoose = require('mongoose')

const CodesSchema = new mongoose.Schema({
    adminid:{
        type:String,
        required:true,
    },
    originallink:{
        type:String,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    userslist:{
        type:[
            {
                uid: String,      // User's unique ID
                username: String  // User's name
            }
        ],
        default: [] ,
    }
},{timestamps:true})

const RoomModel = mongoose.model('codes',CodesSchema)

module.exports = RoomModel;