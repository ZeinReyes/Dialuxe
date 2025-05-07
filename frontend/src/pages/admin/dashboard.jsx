import React, { useState, useContext } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../../context/AuthContext';
import DashboardContent from './DashboardContent';
import Products from './Products';
import Users from './Users';
import Orders from './Orders';

const Dashboard = () => {

  const { logout } = useContext(AuthContext);
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

  const [activeSection, setActiveSection] = useState('dashboard');
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const handleH5Click = () => {
    setClickCount(prevCount => prevCount + 1);
    if (clickCount + 1 === 3) {
      navigate('/home');
    }
  };

  return (
    <div className="dashboard">
      <div className="vh-100 sidebar" style={{ width: '250px' }}>
        <div className="text-center mt-2" onClick={handleH5Click} style={{ cursor: 'pointer' }}>
          <img src="/logo-gold.png" alt="Logo" className="img-fluid" style={{ width: '120px' }} />
          <h5>Dialuxe</h5>
        </div>

        <div className="divider w-75 border-bottom mx-auto"></div>

        <div>
          <ul className="nav flex-column mt-5">
            <li className="nav-item">
              <a
                className={`nav-link ${activeSection === 'dashboard' ? 'active-link' : 'text-white'}`}
                href="#"
                onClick={() => handleNavClick('dashboard')}
              >
                <i className="bi bi-speedometer2 me-5"></i> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeSection === 'products' ? 'active-link' : 'text-white'}`}
                href="#"
                onClick={() => handleNavClick('products')}
              >
                <i className="bi bi-box-seam me-5"></i> Products
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeSection === 'users' ? 'active-link' : 'text-white'}`}
                href="#"
                onClick={() => handleNavClick('users')}
              >
                <i className="bi bi-people me-5"></i> Users
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeSection === 'orders' ? 'active-link' : 'text-white'}`}
                href="#"
                onClick={() => handleNavClick('orders')}
              >
                <i className="bi bi-bag me-5"></i> Orders
              </a>
            </li>
          </ul>
        </div>

        <div className="divider w-75 border-bottom mx-auto mt-5"></div>

        <div className="p-3">
          <a onClick={handleLogout} className="btn btn-outline-danger w-100" href="#">
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </a>
         
        </div>
      </div>

      <main className="content p-5">
        {activeSection === 'dashboard' && <DashboardContent />}
        {activeSection === 'products' && <Products />}
        {activeSection === 'users' && <Users />}
        {activeSection === 'orders' && <Orders />}
      </main>
    </div>
  );
};

export default Dashboard;
