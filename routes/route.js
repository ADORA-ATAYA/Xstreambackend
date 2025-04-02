const express = require('express');
const loginController = require('../controllers/loginController');
const CreateRoomController = require('../controllers/CreateRoomController');
const HandleRoomController = require('../controllers/HandleRoomController');
const router = express.Router()

router.post('/register',loginController.register)
router.post('/login',loginController.login)

router.post('/createroom',CreateRoomController.createroom)
router.post('/addroomcode',CreateRoomController.addCodeToUser)
router.get('/getroomcodes/:uid',CreateRoomController.getroomcodes)
router.get('/getvideolink/:roomcode',CreateRoomController.getvideoUrl);
router.get('/getroom/:roomcode',CreateRoomController.getroom);
router.get('/isroomexists/:roomcode',CreateRoomController.isRoomExists);
router.delete('/deleteroom',CreateRoomController.deleteRoom)


router.post('/addnewmember/:roomcode',HandleRoomController.addRoomMember);
router.post('/removemember/:roomcode',HandleRoomController.leaveRoomMember);
router.get('/findroom-members/:roomcode',HandleRoomController.allroomMembers)

module.exports = router;