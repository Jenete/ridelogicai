import './App.css';
import { CrowdReportsBoard } from './components/CrowdReportsBoard';
import { FareEstimator } from './components/FareEstimator';
import NewsUpdates from './components/NewsUpdates';
import RideLogicAi from './components/RideLogicAi';
import RouteFinder from './components/RouterFinder';
import WelcomeRideLogic from './components/WelcomeRideLogic';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
       <Router>
        <Routes>
          <Route path="/" element={<WelcomeRideLogic />} />
          <Route path="/aichat" element={<RideLogicAi />} />
          <Route path="/search" element={<RouteFinder />} />
          <Route path="/fares" element={<FareEstimator />} />
          <Route path="/news" element={<NewsUpdates />} />
          <Route path="/crowd" element={<CrowdReportsBoard />} />
          <Route path="*" element={<WelcomeRideLogic />} />
        </Routes>
      </Router>
      
         
    </div>
  );
}

export default App;
