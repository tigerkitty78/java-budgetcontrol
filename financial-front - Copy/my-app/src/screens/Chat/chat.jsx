import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the senderId from the URL
import ChatService from "../../APIs/ChatAPI";
import WebSocketService from "../../services/websocket";

const ChatComponent = ({ isGroup, receiverId, groupId }) => {
  const { senderId } = useParams(); // Use useParams to get senderId from URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState(null); // Store receiver details

  useEffect(() => {
    fetchReceiverDetails(); // Fetch receiver details
    fetchDirectMessages(); // Fetch direct messages
    
    WebSocketService.connect((newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [receiverId, groupId, senderId]); // Include senderId as dependency

  console.log("senderrrrrr", senderId);
  
  const fetchReceiverDetails = async () => {
    try {
      const response = await fetch(`http://localhost	:8080/api/user/152`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Include JWT token in header
        },
      });
      const data2 = await response.json();
      console.log("Fetched receiver data:", data2); 
      setReceiver(data2); // Set receiver's details
    } catch (error) {
      console.error("Error fetching receiver details:", error);
    }
  };

  const fetchDirectMessages = async () => {
    try {
      const data = await ChatService.getDirectMessages(senderId, receiverId);
      console.log("data issssssssss", data);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    if (!receiver || !receiver.id) {
      console.error("Receiver is not available or missing ID.");
      return;
    }
  
    try {
      let sentMessage = {
        messageContent: message,
        messageType: "TEXT",
        sentAt: new Date().toISOString(),
        receiver:receiver
      };
  console.log("rrrrrrrrrr",sentMessage)
      
        //sentMessage.receiver = receiver; // Pass the full receiver object
        await ChatService.sendDirectMessage(sentMessage);
      
  
      console.log("Message sent successfully:", sentMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  return (
    <div className="chat-container" style={{ background: "blue" }}>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <p>
              <strong>{msg.sender?.username || "Unknown"}</strong>: {msg.messageContent}
            </p>
            <small>{new Date(msg.sentAt).toLocaleString()}</small> {/* Display readable time */}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;



