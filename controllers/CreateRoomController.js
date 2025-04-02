const RoomModel = require("../models/Codes");
const UserModel = require("../models/Users");

class CreateRoomController {

    static createroom  = async(req,res)=>{
        // console.log("inside create room");       
        try{
            // console.log(req.body);           
            const {roomCode,videoUrl,uid} = req.body
            const newroom = new RoomModel({adminid:uid,originallink:videoUrl,code:roomCode});
            // console.log(newroom);     
            await newroom.save();
            // console.log("data saved 1");         
            res.status(200).json({message:"room created successfully"});
        }catch(e){
            return res.status(401).json({error:e})
        }
        
    }

    static addCodeToUser = async (req, res) => {
        console.log("inside add code to user");
        try {
            // console.log(req.body); 
            const { uid, roomCode } = req.body;
            // console.log("roomCode:",roomCode);
            
            const updatedUser = await UserModel.findOneAndUpdate(
                {uid},
                { $push: { roomcodes: roomCode } },
                { new: true }
            );
            // console.log("updated user",updatedUser); 
        
            if (!updatedUser) {
                return res.status(200).json({ message: "User not found" });
            }
        
            res.status(200).json({ message: "Room added successfully", user: updatedUser });
        } catch (error) {
          res.status(500).json({ message: "Server error", error });
        }
    };

    static getroomcodes = async(req,res) =>{

        try {
            // console.log("enter in getroom codes");
            
            const {uid} = req.params;
            const user = await UserModel.findOne({uid});
            // console.log(user)
            if(user)return res.status(200).json({ user:user});
            return res.status(200).json({ message: "User not found" });
        } catch (error) {
            res.status(500).json({ message: "error while fetching getroom codes", error });
        }
    }

    static getvideoUrl = async(req,res)=>{
        try{

            const {roomcode} = req.params;

            const room= await RoomModel.findOne({code:roomcode});
            if(!room){
                return res.status(200).json({message:"No sich room found"});
            }

            return res.status(200).json({videoUrl:room.originallink});
        }catch(error){
            res.status(500).json({ message: "error while fetching room video link", error });
        }

    }

    static getroom = async(req,res)=>{
        try{
            
            const {roomcode} = req.params;

            const room= await RoomModel.findOne({code:roomcode});
            if(!room){
                return res.status(200).json({message:"No such room found"});
            }

            return res.status(200).json({room:room});
        }catch(error){ 
            res.status(500).json({ message: "error while fetching room video link", error });
        }

    }

    static isRoomExists = async(req,res)=>{
        try{
            
            const {roomcode} = req.params;
            // console.log("roomcode",roomcode);
            
            const room= await RoomModel.findOne({code:roomcode});
           
            if(!room){
                return res.status(200).json({message:"No such room found"});
            }

            return res.status(200).json({message:"room found"});
        }catch(error){ 
            return res.status(500).json({ message: "error while fetching room video link", error });
        }

    }

    static deleteRoom = async(req,res)=>{
       try {
            const {roomcode,userId} = req.body          
            // console.log("enter in deleteroom",roomcode,userId);
            const room  = await RoomModel.findOne({code:roomcode})

            if(room){
                // console.log("Updated user1");
                await RoomModel.deleteOne({code:roomcode})
                // console.log("Updated user2");
                const updatedUser = await UserModel.findOneAndUpdate(
                    { uid: userId }, 
                    { $pull: { roomcodes:roomcode} },  
                    { new: true }
                );

                // console.log("Updated user3",updatedUser);
                

                return res.status(200).json({message:"room deleted successfully"});
            }
            return res.status(404).json({message:"room not found"});
       } catch (error) {
            return res.status(500).json({ message: "error while deleting room", error });
       }
    }
    
}


module.exports = CreateRoomController;