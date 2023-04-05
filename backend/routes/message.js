const express = require('express')
const  { addMessage, getAllChats, getMessages } = require('../controllers/message');


const router = express.Router();

router.post('/message', addMessage);
router.get('/getAllChats/:senderId/:receiverId', getAllChats);
router.get('/message/:chatId', getMessages);




module.exports= router;