import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import './App.css';
import QuoteModel from './components/QuoteModel';
import UserModel from './components/UserModel';
import LoginModel from './components/LoginModel';

function App() {
 return (
    <Router>
     <Routes>
     <Route path="/" element={<Navigate to="/login" />} />
      <Route path='/home' element={<QuoteModel/>}/>
      <Route path='/signup' element={<UserModel/>}/>
      <Route path='/login' element={<LoginModel/>}/>
     </Routes>
    </Router>
  );
}

export default App;
