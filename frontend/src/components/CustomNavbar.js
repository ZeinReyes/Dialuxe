import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CustomNavbar.css';

const CustomNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact Us</Link>
      </div>

      <div className="nav-logo">
        <img src="logo-gold.png" style={{ width: '90px' }} />
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <Link to="/cart" className="cart-link">
              <button  className="logout-btn">Cart</button>
            </Link>
            <Link to={user.role === 'admin' ? '/admin' : '/client'}>
              {user.username || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
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
