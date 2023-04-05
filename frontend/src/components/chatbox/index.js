import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { RxCross2 } from "react-icons/rx";
import { BsPlusCircleFill } from "react-icons/bs";
import { MdStickyNote2 } from "react-icons/md";
import { TiVideo } from "react-icons/ti";
import { RiFileGifLine } from "react-icons/ri";
import { BsEmojiSmileFill } from "react-icons/bs";
import { HiThumbUp } from "react-icons/hi";
import { Photo } from "../../svg";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  addMessage,
  getAllMessages,
  getMessages,
} from "../../functions/message";
import { format } from "timeago.js";

function Chatbox({ profile, setChatBox }) {
  const { user } = useSelector((state) => ({ ...state }));
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [text, setText] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const scroll = useRef();

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", user.id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await getAllMessages(user.id, profile._id);
        if (result) {
          setAllMessages(result?.messages);
          setChatId(result?.chatId);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, []);

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();

    const messageData = {
      senderId: user.id,
      text: text,
      chatId: chatId,
      receiverId: profile._id,
    };

    // send message to socket server
    setSendMessage({ ...messageData });
    // send message to database

    try {
      const data = await addMessage(messageData);
      setAllMessages([...allMessages, { ...data }]);
      setChatId(data.chatId);
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  // Receive Message
  useEffect(() => {
    if (receivedMessage !== null) {
      setAllMessages([...allMessages, receivedMessage]);
      console.log("receivedMessage", receivedMessage);
    }
  }, [receivedMessage]);

  const online = onlineUsers.find((user) => user.userId === profile._id);

  return (
    <div className="chatbox">
      <div className="personDetail">
        <div className="left">
          <div className="img">
            {" "}
            <img src={profile.picture} />
            <div className={online ? "online" : "offline"}></div>{" "}
          </div>
          <div className="name">
            {profile.first_name} {} {profile.last_name}
          </div>
        </div>
        <div className="right">
          <div className="cross" onClick={() => setChatBox(false)}>
            <RxCross2 />
          </div>
        </div>
      </div>
      <div className="chats">
        {allMessages &&
          allMessages.map((message, i) => (
            <>
              <div
                key={i}
                className={message?.senderId === user.id ? "mine" : "him"}
                ref={scroll}
              >
                <div className="singleChatBox">
                  <img
                    src={profile.picture}
                    alt="img"
                    style={{
                      display: `${
                        message?.senderId === user.id ? "none" : "flex"
                      }`,
                    }}
                  />
                  <div className="chatText">{message?.text}</div>
                </div>
                <div className="time">{format(message?.createdAt)}</div>
              </div>
            </>
          ))}
      </div>
      <div className="bottom">
        <div className="icons">
          <BsPlusCircleFill size={22} />
          <Photo />
          <MdStickyNote2 size={22} />
          <RiFileGifLine size={22} />
        </div>
        <div className="inputEmoji">
          <input
            type="text"
            placeholder="Aa"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <BsEmojiSmileFill size={20} />
        </div>
        <div className="like">
          <HiThumbUp size={28} onClick={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
