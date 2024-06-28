import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateEmployee from './components/CreateEmployee'
import Details from './components/Details'
import Login from './components/Login'
import Home from './components/Home'
import PrivateRoute from './components/PrivateRoute';
import Signup from './components/Signup';

const App = () => {
  return (
      <Router>
          <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Signup />} />
              <Route element={<PrivateRoute />} >
                <Route path='/' element={<Home />} />
                <Route path='/employee/:id' element={<Details />} />
                <Route path='/employee/new' element={<CreateEmployee />} />
              </Route>
          </Routes>
      </Router>
  );
};

export default App
