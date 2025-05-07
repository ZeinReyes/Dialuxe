import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import AdminPage from './pages/admin/dashboard';
import ClientPage from './pages/client/ClientPage';
import ClientProductPage from './pages/client/ClientProductPage';
import CartPage from './pages/client/ClientCartPage';
import Layout from './layouts/Layout'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<ClientPage />} />
        <Route path="products" element={<ClientProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>

      {user && user.role === 'admin' && (
        <Route path="/admin" element={<AdminPage />} />
      )}

      <Route
        path="*"
        element={<Navigate to={user?.role === 'admin' ? '/admin' : '/'} />}
      />
    </Routes>
  );
}

export default App;
