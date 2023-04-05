const express = require('express')
const  { createChat, findChat, userChats }= require('../controllers/chat');
const router = express.Router()


router.get('/chat/:userId', userChats);


module.exports= router;