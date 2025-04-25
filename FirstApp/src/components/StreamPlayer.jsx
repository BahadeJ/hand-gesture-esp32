import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function StreamPlayer() {
  const [gestureData, setGestureData] = useState({
    cam1: { gesture: "none", message: "Waiting for input..." },
    cam2: { gesture: "none", message: "Waiting for input..." },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGestureStatus("cam1");
      fetchGestureStatus("cam2");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchGestureStatus = async (camId) => {
    try {
      const response = await axios.get(`${API_URL}/gesture/status/${camId}`);
      const gesture = response.data.gesture || "none";
      const message = response.data.translatedMessage || "No gesture detected";

      setGestureData((prev) => ({
        ...prev,
        [camId]: {
          gesture,
          message,
        },
      }));
    } catch (error) {
      console.error(`Error fetching gesture for ${camId}:`, error);
      setGestureData((prev) => ({
        ...prev,
        [camId]: {
          gesture: "none",
          message: "No gesture detected",
        },
      }));
    }
  };

  const renderCameraSection = (camId) => {
    const { gesture, message } = gestureData[camId];
    return (
      <div className="flex flex-col items-center p-4 w-full md:w-1/2">
        <h2 className="text-2xl font-bold text-white mb-2">
          {camId.toUpperCase()}
        </h2>
        <div className="rounded-xl overflow-hidden border-4 border-white shadow-lg mb-4">
          <img
            src={`${API_URL}/video_feed/${camId}`}
            alt={`Live video feed from ${camId}`}
            className="w-full max-w-md object-contain"
          />
        </div>
        <div className="text-center">
          <h3 className="text-white text-lg">Detected Gesture:</h3>
          <p
            className={`text-xl font-semibold ${
              gesture === "none" ? "text-gray-400" : "text-green-400"
            }`}
          >
            {gesture}
          </p>
          <h3 className="text-white text-lg mt-2">Translated Message:</h3>
          <p className="text-blue-300 text-md">{message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Dual Camera Gesture Feed
      </h1>
      <div className="flex flex-row justify-center gap-6">
        {renderCameraSection("cam1")}
        {renderCameraSection("cam2")}
      </div>
    </div>
  );
}

export default StreamPlayer;
