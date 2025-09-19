import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ use react-router-dom
import './header.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token or user data exists in localStorage
    const token = localStorage.getItem("token") || localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleCart = () => {
    console.log('Cart toggled');
  };

  return (
    <nav className="navbar navbar-expand-md bg-white shadow sticky-top py-2">
      <div className="container-fluid px-5">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center me-3">
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/82fc7cdb-c82e-4736-8e9a-14a800d56f8d.png"
              alt="MediLab logo"
              className="rounded-circle bg-primary"
              style={{ width: '40px', height: '40px' }}
            />
            <span className="ms-2 fs-2 fw-bold text-primary">MediLab</span>
          </div>

          <div className="d-none d-md-flex ms-4 gap-3">
            <ul className="nav fs-5 fw-bold ">
              <li className="nav-item">
                   <a className="nav-link" href="#" >
                     <Link className="nav-link" to="/">Home</Link>
                   </a>
                </li>

              <li className="nav-item">
               <a className="nav-link" href="#" >
                <Link className="nav-link" to="/book-test">Book Tests</Link>
                </a>
              </li>


              <li className="nav-item">
               <a className="nav-link" href="#" >
                <Link className="nav-link" to="/my-orders">My Orders</Link>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div>
            <Link to="/account">
              <i className="bi bi-person-circle"></i>
            </Link>
          </div>

          {isLoggedIn ? (
            <button className="Login-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="Login-btn">
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                Login/Signup
              </Link>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;