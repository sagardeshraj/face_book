import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { MdVideoCall } from 'react-icons/md';
import { AiOutlineFullscreen } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';
import { Search } from '../../svg';
import { getUserChat } from '../../functions/userChat';
import { useSelector } from 'react-redux';
import Conversation from './Conversation';


function ChatMenu({setShowChatBox, setCurrentChat,setShowChatMenu}) {

  const {user} = useSelector((state)=>({...state}))

  const [userChats, setUserChats] = useState([])

  useEffect(() => {
    const getChats = async () => {
      try {
        const data = await getUserChat(user.id);
        setUserChats(data)
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user.id]);

  return (
    <div className='chatmenu scrollbar'>
        <div className="chat_header">
            <div className="text">Chats</div>
            <div className="icons">
                <div className='hover5'><BsThreeDots size={22}/></div>
                <div className='hover5'><AiOutlineFullscreen size={22}/></div>
                <div className='hover5'><MdVideoCall size={22}/></div>
                <div className='hover5'><BiEdit size={22}/></div>
            </div>
        </div>
        <div className="chatInput">
            <Search />
            <input type="text" placeholder='Search Messanger'/>
        </div>
        <div>
         {
          userChats && userChats.map((chat,i)=>(
            <div className='chatt' key={i} onClick={()=>{setShowChatBox(true); setCurrentChat(chat); setShowChatMenu(false)}}>
              <Conversation chat={chat} />
            </div>
          ))
         }
        </div>
    </div>
  )
}

export default ChatMenu