import React, { useEffect, useState } from 'react';
import api from '../../../services/axiosInstance';
import { Navigate, Outlet } from "react-router-dom";

function AuthenticateAdmin() {
  const adminId = localStorage.getItem("adminId");
  const [isLoading, setIsLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const response = await api.get(`/admin/role/getDetails?adminId=${adminId}`);
        if (response.data.success) {
          setAdminExists(true);
        } else {
          setAdminExists(false);
        }
      } catch (error) {
        console.log('error in AuthenticateAdmin', error);
        setAdminExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (adminId) {
      getAdmin();
    } else {
      setIsLoading(false);
    }
  }, [adminId]);

  if (isLoading) return null; // Or a loading spinner

  return adminExists ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default AuthenticateAdmin;
