import React, { useState } from "react";
import NavBar from "../layouts/NavBar";
import { motion } from "framer-motion";

function AboutUs() {
  return (
    <div className="w-full h-screen">
      <NavBar />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 3 }}
      >
        <h1>
          {" "}
          Our project focuses on real-time gesture recognition for helping
          people in need
        </h1>
      </motion.div>
    </div>
  );
}

export default AboutUs;
