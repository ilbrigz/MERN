import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

class App extends Component {
    render() {
        return (
            <Router>
      <div className="App">
      <Navbar/>
      <Route path="/" component={ Landing } exact />
      <Route path="/login" component={ Login } exact />
      <Route path="/register" component={ Register } exact />
      <Footer/>
      </div>
      </Router>
        );
    }
}

export default App;