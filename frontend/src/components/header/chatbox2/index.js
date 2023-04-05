import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./style.css";
import { RxCross2 } from "react-icons/rx";
import { BsPlusCircleFill } from "react-icons/bs";
import { MdVideocam } from "react-icons/md";
import { MdStickyNote2 } from "react-icons/md";
import { RiFileGifLine } from "react-icons/ri";
import { BsEmojiSmileFill } from "react-icons/bs";
import { HiThumbUp } from "react-icons/hi";
// import { Photo } from '../../svg';
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import { getUser } from "../../../functions/user";
import { addMessage, getMessages } from "../../../functions/message";
import { Photo } from "../../../svg";
import Peer from "simple-peer";

function ChatBox2({
  chat,
  setShowChatBox,
  showCallingScreen,
  setShowCallingScreen,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const [otherUser, setOtherUser] = useState({});
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [text, setText] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const scroll = useRef();
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const peerInstance = useRef(null);
  const [stream, setStream] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callingPerson, setSetCallingPerson] = useState(null);
  const [showAcceptButton, setShowAcceptButton] = useState(false);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // fetching data for header
  useEffect(() => {
    const userId = chat.members.find((id) => id !== user.id);
    const getUserData = async () => {
      try {
        const data = await getUser(userId);
        setOtherUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, user.id]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await getMessages(chat._id);
        if (result) {
          setAllMessages(result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, []);

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

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();

    const messageData = {
      senderId: user.id,
      text: text,
      chatId: chat._id,
      receiverId: otherUser._id,
    };

    // send message to socket server
    setSendMessage({ ...messageData });
    // send message to database

    try {
      const data = await addMessage(messageData);
      setAllMessages([...allMessages, { ...data }]);
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

  const online = onlineUsers.find((user) => user.userId === otherUser._id);


  // useEffect(() => {

  //     socket.current.on("giveSignal", (data) => {
  //     setShowAcceptButton(true);
  //     setCallerSignal(data.signal);
  //     setSetCallingPerson(data.from);
  //     setShowCallingScreen(true);
  //   });
  // }, []);

  const call = (myId, hisId) => {
    setShowCallingScreen(true);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        localStream.current.srcObject = stream;
      });

  };

  // const acceptCall = ()=>{
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: stream,
  //   });

  //   peer.on("signal", (data) => {
  //     socket.current.emit("answerCall", { signal: data, to: callingPerson });
  //   });

  //   peer.on("stream", (stream) => {
  //     remoteStream.current.srcObject = stream;
  //     remoteStream.current.addEventListener("loadedmetadata", () => {
  //       remoteStream.current.play();
  //     });
  //   });

  //   peer.signal(callerSignal);
  //   peerInstance.current = peer;
  //   setShowAcceptButton(false);
  // }

  return (
    <div className="chatbox">
      <div className="personDetail">
        <div className="left">
          <div className="img">
            {" "}
            <img src={otherUser.picture} />
            <div className={online ? "online" : "offline"}></div>{" "}
          </div>
          <div className="name">
            {otherUser.first_name} {} {otherUser.last_name}
          </div>
        </div>
        <div className="right">
          <div className="cross" onClick={() => setShowChatBox(false)}>
            <RxCross2 />
          </div>
          <div className="vid_call" onClick={()=> call(user.id, otherUser._id )}>
            <MdVideocam size={15} />
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
                    src={otherUser?.picture}
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
      {showCallingScreen && (
        <div className="callingScreen">
          <div
            className="MyVid"
            style={{
              width: "20%",
              height: "40%",
              position: "absolute",
              right: "20px",
              bottom: "20px",
              zIndex: "999",
              border: "1px solid black",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <video
              controls
              autoPlay
              muted
              ref={localStream}
              style={{ width: "100%", height: "120%", objectFit: "cover" }}
            ></video>
          </div>
          <div className="RemVid" style={{ width: "100%" }}>
            <video
              controls
              ref={remoteStream}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            ></video>
          </div>
          <div className="accept_call_from_other_side" style={{color:"white"}} >
            {
              showAcceptButton && <button style={{position:"absolute", padding:"10px", background:"green" }}  onClick={()=>{}} >Accept Call</button>
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox2;
