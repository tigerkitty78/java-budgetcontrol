import { useEffect } from "react";

const HeatmapTracker = () => {
  useEffect(() => {
    const handleClick = (event) => {
      const { clientX, clientY } = event;
      console.log(`User clicked at: (${clientX}, ${clientY})`);
      sendDataToServer({ x: clientX, y: clientY }); // Send to backend
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const sendDataToServer = async (data) => {
    try {
      await fetch("http://localhost	:8080/api/heatmap/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error sending heatmap data:", error);
    }
  };

  return null; // No UI needed, just tracking events
};

export default HeatmapTracker;
