// src/services/WebSocketService.js
// src/services/WebSocketService.js
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";
 // Import JWT decoder

class WebSocketService {
  constructor() {
    this.client = null;
  }

  connect(onMessageReceived) {
    const token = localStorage.getItem("jwtToken"); // Get JWT Token

    if (!token) {
      console.error("WebSocket connection failed: No token found.");
      return;
    }

    // Decode token and get username
    let username = "Unknown User";
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.sub || "Unknown User"; // 'sub' is commonly used for username in JWT
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }

    console.log("Current User:", username); // Log the current user's name

    this.client = new Client({
      brokerURL: `ws://192.168.8.175:8080/ws?token=${token}`, // Pass token
      connectHeaders: {
        Authorization: `Bearer ${token}`, // ✅ Send token in headers
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`WebSocket Connected as ${username}`);

        // Subscribe to messages
        this.client.subscribe("/user/queue/messages", (message) => {
          console.log("🔵 Subscribed to /user/queue/messages");
          console.log("🟢 Message received:", message.body);
          console.log("Message received:", message.body);
          const parsedMessage = JSON.parse(message.body);
          onMessageReceived(parsedMessage);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    this.client.activate();
  }

  sendMessage(destination, message) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error("WebSocket is not connected.");
    }
  }
}

export default new WebSocketService();
