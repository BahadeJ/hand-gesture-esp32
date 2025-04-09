import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // FastAPI backend

function StreamPlayer() {
  const [detectedGesture, setDetectedGesture] = useState("None");
  const [translatedMessage, setTranslatedMessage] = useState("Waiting for input...");

  useEffect(() => {
    const interval = setInterval(fetchGestureStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchGestureStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/gesture/status`);
      const gesture = response.data.gesture || "none";
      const message = response.data.translatedMessage || "Waiting for input...";
      setDetectedGesture(gesture);
      setTranslatedMessage(message);
    } catch (error) {
      console.error("Error fetching gesture status:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Live Camera Feed</h1>

      <div className="rounded-xl overflow-hidden border-4 border-white shadow-lg">
        <img
          src={`${API_URL}/video_feed`}
          alt="Live video feed"
          className="w-full h-auto max-w-lg object-contain"
        />
      </div>

      <div className="mt-6 text-center">
        <h2 className="text-xl text-white mb-2">Detected Gesture:</h2>
        <p
          className={`text-2xl font-semibold ${
            detectedGesture === "none" ? "text-gray-400" : "text-green-400"
          }`}
        >
          {detectedGesture === "none" ? "None" : detectedGesture}
        </p>

        <h2 className="text-xl text-white mt-4 mb-2">Translated Message:</h2>
        <p className="text-lg text-blue-300">{translatedMessage}</p>
      </div>
    </div>
  );
}

export default StreamPlayer;
