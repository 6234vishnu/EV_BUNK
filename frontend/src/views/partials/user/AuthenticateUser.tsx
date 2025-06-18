import React, { useEffect, useState } from 'react';
import api from '../../../services/axiosInstance';
import { Navigate, Outlet } from "react-router-dom";

function AuthenticateUser() {
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const response = await api.get(`/user/getDetails?userId=${userId}`);
        if (response.data.success) {
            setUserExists(true);
        } else {
            setUserExists(false);
        }
      } catch (error) {
        console.log('error in AuthenticateUser', error);
        setUserExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      getAdmin();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) return null; 

  return userExists ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AuthenticateUser;
