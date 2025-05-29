import axios from "axios";

const API_BASE_URL = "http://localhost	:8080/api/messages"; // Backend URL

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("No token found. Please log in.");
  return { Authorization: `Bearer ${token}` };
};

const ChatService = {
  // Send a direct message
  sendDirectMessage: async (receiver, messageContent, messageType) => {
    console.log("Receiver Object:", receiver);
  
    if (!receiver || !receiver.id) {
      console.error("Error: Receiver ID is missing!", receiver);
      return;
    }
  
    try {
      const sentMessage = {
        receiver: { id: receiver.id }, // ✅ Only send ID
        messageContent,
        messageType,
        sentAt: new Date().toISOString(),
      };
  
      console.log("Sending message:", sentMessage);
  
      const response = await axios.post(
        `${API_BASE_URL}/direct`,
        sentMessage,
        { headers: getAuthHeaders() }
      );
  
      console.log("Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending direct message:", error);
      throw error.response?.data || error.message;
    }
  },
  
  
  

  // Send a group message
  sendGroupMessage: async (groupId, content, messageType) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/group`,
        { groupId, content, messageType },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending group message:", error);
      throw error.response?.data || error.message;
    }
  },

  // Get direct messages
 // Updated API call with senderId from URL
 getDirectMessages : async (senderId, receiverId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/direct/${senderId}`, {
      headers: getAuthHeaders(),
      // Pass receiverId as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching direct messages:", error);
    throw error.response?.data || error.message;
  }},


  // Get group messages
  getGroupMessages: async (groupId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/group/${groupId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching group messages:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default ChatService;

