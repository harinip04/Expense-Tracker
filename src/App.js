import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';
import SideBar from './components/sidebar';
import Dashboard from './components/dashboard';
import Expense from './components/expense';

function App() {

  return (
    <div className="app-container">
      <Router>
        <SideBar />
        <div className="app-content">
          <Route path ="/" exact component={Dashboard}/>
          <Route path ="/expense" exact component={Expense}/>
        </div>
      </Router>
    </div>
  );
}

export default App;