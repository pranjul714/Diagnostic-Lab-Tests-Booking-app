import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './component/Home/Index';
import LoginForm from './component/Auth/LoginForm';
import BookTest from './component/Orders/BookTest';
import Register from './component/Auth/Register';
import Account from './component/Profile/Account';
import Footer from './component/Home/Footer';
import MyOrder from "./component/Orders/MyOrder";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-test" element={<BookTest />} />
        <Route path="/account" element={<Account />} />
        <Route path={`/my-orders`} element={<MyOrder />} />
       
      </Routes>
    </Router>
   
  );
}

export default App;