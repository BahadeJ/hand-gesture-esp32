import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from "./pages/LandingPage";
import MonitoringPage from './pages/MonitoringPage';

function App () {
  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path='/monitor' element={<MonitoringPage/>}/>
        </Routes>
      </Router>
    </>
  );
}; 

export default App;