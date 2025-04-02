const mongoose = require('mongoose')
require("dotenv").config()


// const URL = "mongodb://localhost:27017/Xstream"
const database_url = process.env.MONGODB_URL

const connectDB = ()=>{

    return mongoose.connect(database_url)
    .then(()=>{
        console.log("Database connected.");     
    })
    .catch((e)=>{
        console.log("Database Connection error:",e);
        
    })
}

module.exports = connectDB;