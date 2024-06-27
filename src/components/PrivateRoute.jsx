import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      const url = `http://localhost:5103/api/Employee/1`;
      try {
        const resp = await axios.get(url, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        setIsAuthenticated(resp.status === 200);
      } catch (e) {
        console.error(`Cannot get response: ${e.message}`);
        setIsAuthenticated(false);
      }
    };
    
    validateToken();
  }, [token]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
