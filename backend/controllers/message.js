const Message = require('../models/Message')
const Chat = require('../models/Chat')

exports.addMessage = async (req, res) => {
  const {text, senderId, receiverId ,chatId} = req.body;
  try {
    const chatid = await Chat.findOne({
      members: { $all: [senderId, receiverId]},
    });

    if(!chatid){
        const newChat = new Chat({
          members: [senderId, receiverId]
        });
        const finalChat = await newChat.save();
        const message = new Message({
          chatId:finalChat._id,
          senderId:senderId,
          text:text,
        });
      const finalMessage = await message.save();
      res.status(200).json(finalMessage);
    }else{
      const message = new Message({
        chatId: chatid._id,
        senderId,
        text,
      });
      
      const result = await message.save();
      res.status(200).json(result);

    }

  } catch (error) {
    res.status(500).json(error);
  }
};




exports.getAllChats = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const chatData = await Chat.findOne({
      members: { $all: [senderId, receiverId]}
    });

    if(chatData){
      const allMessages = await Message.find({chatId:chatData._id})
      if(allMessages){
        let detail = {
          messages: allMessages,
          chatId:chatData._id
        }
        res.status(200).json(detail)
      }
    }
    else{
      return res.status(200).json();
    }
   

  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await Message.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

