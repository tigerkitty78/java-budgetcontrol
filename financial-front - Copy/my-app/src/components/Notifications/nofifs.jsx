import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
const username = "chimpu";
  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost	:8080/api/notifications/notifications/stream?username=${username}`
    );

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      console.log("📨 Notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    };

    eventSource.onerror = () => {
      console.warn("❌ EventSource failed.");
      eventSource.close();
    };

    return () => eventSource.close();
  }, [username]);

  return (
    <div>
      <h2>🔔 Notifications</h2>
      {notifications.map((n, i) => (
        <div key={i}>
          <b>{n.type}</b>: {n.message}
        </div>
      ))}
    </div>
  );
}




