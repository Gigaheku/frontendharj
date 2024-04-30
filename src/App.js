import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Customers from './components/Customers';
import Trainings from './components/Trainings';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Customers</Link>
            </li>
            <li>
              <Link to="/trainings">Trainings</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Customers />} />
          <Route path="/trainings" element={<Trainings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
