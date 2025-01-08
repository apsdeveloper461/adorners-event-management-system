import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../components/CustomLoading.jsx'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

const AuthMiddlewareAdmin = ({ children }) => {

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("here in auth middleware");

  useEffect(() => {
      
          const token = localStorage.getItem('token');
          if (!token) {
              navigate('/login');
            return;
          }

            const checkToken = async () => {
                try {
                    const response = await axios.post(`${backendUrl}/api/authenticate`, { token, userType: 'admin' });
                    console.log(response.data);
                    if(response.data.success)
                             setIsLoading(false);
                    else
                        navigate('/login');
                } catch (error) {
                    console.error(error);
                    navigate('/login');
                }
            };

            checkToken();
    }, [navigate]); // Ensure the dependency is an array

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthMiddlewareAdmin;
