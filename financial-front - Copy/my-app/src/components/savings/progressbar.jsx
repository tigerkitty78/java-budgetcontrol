import React, { useState, useEffect } from "react";
//import './SavingProgress.css'; // Import your CSS file

const SavingProgress = ({ savingId }) => {
    const [progress, setProgress] = useState(0); // State to track progress
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    // Random function to simulate the change in progress
    const random = (min, max) => Math.random() * (max - min) + min;

    // Function to update the progress dynamically
    const updateProgress = (offsetY) => {
        const sliderHeight = document.getElementById("slider").offsetHeight;
        const pos = Math.max(0, Math.min(sliderHeight - 20, offsetY));
        const newProgress = Math.max(
            0,
            Math.min(100, 100 - (offsetY / sliderHeight) * 100)
        );

        setProgress(Math.round(newProgress * 0.42));
        document.getElementById("slider").style.setProperty("--pos", `${pos}px`);
        document.getElementById("device").style.setProperty("--progress", `${newProgress}%`);
    };

    useEffect(() => {
        // Simulate dynamic progress update every 2 seconds
        const interval = setInterval(() => {
            const offsetY = random(0, document.getElementById("slider").offsetHeight - 20);
            requestAnimationFrame(() => updateProgress(offsetY));
        }, 2000);

        setIntervalId(interval);

        // Cleanup interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const handlePointerDown = () => {
        setIsPointerDown(true);
        clearInterval(intervalId); // Stop the interval when dragging starts
    };

    const handlePointerMove = ({ offsetY }) => {
        if (isPointerDown) {
            updateProgress(offsetY); // Update progress while dragging
        }
    };

    const handlePointerUp = () => {
        setIsPointerDown(false);
    };

    const handlePointerLeave = () => {
        setIsPointerDown(false);
        clearInterval(intervalId); // Restart the interval when pointer leaves
    };

    return (
        <div>
        <div className="device" id="device">
            <div className="number" id="number">{progress}</div>
            <div className="thermostat">
                <div className="bar"></div>
                <div className="glass-container">
                    <div className="glass"></div>
                    <div className="liquid">
                        <div className="bg"></div>
                        <div className="bubbles"></div>
                    </div>
                    <div className="glass-reflection"></div>
                </div>
                <div
                    className="slider"
                    id="slider"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerLeave}
                ></div>
            </div>
        </div></div>
    );
};

export default SavingProgress;
