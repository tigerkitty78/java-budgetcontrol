import { useEffect, useState } from "react";
import h337 from "heatmap.js";

const HeatmapViewer = () => {
    const [heatmapInstance, setHeatmapInstance] = useState(null);

    useEffect(() => {
        const heatmapContainer = document.createElement("div");
        heatmapContainer.style.position = "absolute";
        heatmapContainer.style.top = "0";
        heatmapContainer.style.left = "0";
        heatmapContainer.style.width = "100vw";
        heatmapContainer.style.height = "100vh";
        heatmapContainer.style.pointerEvents = "none"; // So users can still click buttons
        heatmapContainer.style.zIndex = "9999"; // Ensure it's on top of everything
        document.body.appendChild(heatmapContainer);

        const heatmap = h337.create({
            container: heatmapContainer,
            radius: 30,
            maxOpacity: 0.6,
            minOpacity: 0.2,
            blur: 0.75,
        });

        setHeatmapInstance(heatmap);

        fetch("http://localhost	:8080/api/heatmap/data") // Fetch click data from backend
            .then((response) => response.json())
            .then((data) => {
                let points = data.map(({ x, y }) => ({ x, y, value: 1 }));
                heatmap.setData({ max: 10, data: points });
            })
            .catch((error) => console.error("Error fetching heatmap data:", error));

        return () => {
            document.body.removeChild(heatmapContainer); // Clean up when component unmounts
        };
    }, []);

    return null; // No UI needed, it's injected dynamically
};

export default HeatmapViewer;
