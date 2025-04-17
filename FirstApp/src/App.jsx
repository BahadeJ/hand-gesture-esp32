import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import {AnimatePresence} from 'framer-motion';
import LandingPage from "./pages/LandingPage";
import AnalyticsPage from './pages/AnalyticsPage';

function AnimatedRoutes() {
  const location = useLocation();

  return(
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/analytics" element={<AnalyticsPage/>}/>
      </Routes>
    </AnimatePresence>
  );
};

function App () {
  return(
    <>
      <Router>
        <AnimatedRoutes/>
      </Router>
    </>
  );
}; 

export default App;