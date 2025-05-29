import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("jwtToken"); // or wherever you store it

  // Polling every 10 seconds
  useEffect(() => {
    const fetchNotifications = () => {
      axios
        .get("http://localhost	:8080/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error("Error fetching notifications", err));
    };

    fetchNotifications(); // initial fetch
    const interval = setInterval(fetchNotifications, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [token]);

  const markAsRead = (id) => {
    axios
      .post(`http://localhost	:8080/api/notifications/mark-read/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== id)
        );
      })
      .catch((err) => console.error("Error marking notification as read", err));
  };

  return (
    <div className="p-4 border rounded w-96 bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-2">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className="flex justify-between items-start bg-gray-50 p-2 rounded shadow-sm"
            >
              <div>
                <p className="text-sm font-medium">{notif.type}</p>
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => markAsRead(notif.id)}
                className="text-blue-500 text-sm hover:underline"
              >
                Mark as read
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
