import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AboutUs from "./pages/AboutUs";

function AnimatedRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/aboutUs" element={<AboutUs />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <Router>
        <AnimatedRoutes />
      </Router>
    </>
  );
}

export default App;
