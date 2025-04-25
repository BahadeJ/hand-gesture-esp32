import React from "react";
import NavBar from "../layouts/NavBar.jsx";
import HandGesureBg from "../assets/HandGesture.png";
import StreamPlayer from "../components/StreamPlayer.jsx";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <div>
      <NavBar />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 1 }}
        className="w-full h-screen"
      >
        <div className="border-black/80">
          <div className="flex flex-row">
            <div
              className="w-2xl bg-centers flex flex-col justify-center p-4"
              style={{ backgroundImage: `url(${HandGesureBg})` }}
            >
              <h1 className="text-left text-white font-bold text-4xl">
                Welcome to GestureCare
              </h1>
              <h2 className="text-justify text-white mt-2 text-[20px] font-light flex-wrap">
                Enhancing communication and understanding
                <br /> through innovative gesture recognition technology.
              </h2>
            </div>
            <div className="w-3xl bg-[#336B81]">
              <StreamPlayer />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LandingPage;
