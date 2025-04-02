const UserModel = require("../models/Users");
const admin = require('../utils/FireBaseAdmin')

class loginController{

    static login = async()=>{

    }

    static register = async(req,res) =>{
        // console.log("enter in register");
        
        const token = req.headers.authorization?.split(" ")[1]; 
        // console.log(token);     
        if (!token) {
           ({ error: "No token provided" });
        }
        try {
          // **Verify Firebase Token**
          const decodedToken = await admin.auth().verifyIdToken(token);
          const { uid, name, email} = decodedToken;
      
          // **Check if user exists**
          let user = await UserModel.findOne({ uid });
          if (!user) {
            user = new UserModel({ uid, name, email});
            await user.save();
          }
      
          res.status(200).json(user);
        } catch (error) {
          res.status(401).json({ error: "Unauthorized" });
        }
    }
}

module.exports = loginController;