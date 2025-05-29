import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketComponent = ({ receiverUsername }) => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    const socket = new SockJS("/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Auto-reconnect after 5 seconds
      onConnect: (frame) => {
        console.log("Connected: " + frame);
        client.subscribe("/user/queue/messages", (messageOutput) => {
          console.log("Received message: " + messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, JSON.parse(messageOutput.body)]);
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket error:", frame);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
        console.log("Disconnected");
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && messageContent) {
      const message = {
        receiverUsername: receiverUsername,
        messageContent: messageContent,
        messageType: "TEXT",
      };
      stompClient.publish({ destination: "/app/chat/private", body: JSON.stringify(message) });
      setMessageContent("");
    }
  };

  return (
    <div>
      <h2>WebSocket Chat</h2>
      <div>
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h3>Messages</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.messageContent}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
