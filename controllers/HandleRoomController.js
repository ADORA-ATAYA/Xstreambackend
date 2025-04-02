const RoomModel = require("../models/Codes");

class HandleRoomController{
    static allroomMembers = async(req,res)=>{
        try {
            const {roomcode} = req.params
            const data = await RoomModel.find({code:roomcode})
            if(data){
                return res.status(200).json({rooms:data})
            }
            return res.status(200).json({message:"no member found"});
        } catch (error) {
            return res.status(500).json({ message: "error while fetching room members", error });
        }
    }

    static addRoomMember = async(req,res)=>{
        try {
            const {roomcode} = req.params
            const {uid,username} = req.body
            // console.log(roomcode,uid,username);           
            const updatedUser = await RoomModel.findOneAndUpdate(
                { code: roomcode },
                { $push: { userslist: { uid, username } } },
                { new: true }
            );
        
            if (!updatedUser) {
                return res.status(404).json({ message: "Room not found or user not added" });
            }
            return res.status(200).json({message:"user join room successfully"});
        } catch (error) {
            return res.status(400).json({ message: "error while adding room member", error });
        }
    }

    static leaveRoomMember = async(req,res)=>{
        try {
            const {roomcode} = req.params
            const {uid,username} = req.body
            const updatedUser = await RoomModel.findOneAndUpdate(
                {code:roomcode},
                { $pull: { userslist: {uid}} },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ message: "Room not found or user not added" });
            }
            return res.status(200).json({message:"user leave room successfully"});
        } catch (error) {
            return res.status(500).json({ message: "error while leaving room member", error });
        }
    }
    
}

module.exports = HandleRoomController