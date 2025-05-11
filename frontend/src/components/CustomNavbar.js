import React, { useContext, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CustomNavbar.css';

const CustomNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clickedOpen, setClickedOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setClickedOpen(!clickedOpen);
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    if (!clickedOpen) setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (!clickedOpen) {
      timeoutRef.current = setTimeout(() => {
        setDropdownOpen(false);
      }, 200);
    }
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
      </div>

      <div className="nav-logo">
        <img src="logo-gold.png" style={{ width: '90px' }} alt="Logo" />
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <Link to="/cart" className="cart-link">
              <button className="logout-btn">Cart</button>
            </Link>
            <Link to="/orders" className="order-link">
              <button className="logout-btn">Orders</button>
            </Link>

            <div
              className="profile-dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button onClick={toggleDropdown} className="profile-icon ms-4 me-2 bg-warning">
                {user.name?.charAt(0).toUpperCase() || 'P'}
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="profile-link">
                    Profile
                  </Link>
                  <button className='ms-2' onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomNavbar;
