import React, { useEffect, useState } from 'react';
import {
  Home,
  UserPlus,
  Ticket,
  CreditCard,
  Users,
  Calendar,
  X,
  Menu,
  ClipboardCheck,
  Book,
} from 'lucide-react';
import '../../../assets/css/partials/admin/sidebar.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/axiosInstance';

const AdminNav = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [adminName, setAdminName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    if (!adminId) {
      setMessage("Couldn't find any user. Please log in first.");
      return;
    }

    const getAdmintData = async () => {
      try {
        const response = await api.get(`/admin/role/getDetails?adminId=${adminId}`);
        if (response.data.success) {

            setAdminName(response.data.admin?.name);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.log('error in get admin data', error);
        setMessage('Server error, try again later');
      }
    };

    getAdmintData();
  }, [adminId]);

  const handleLogout = async () => {
    const adminId = localStorage.getItem('adminId');
    try {
      const response = await api.post(`/admin/auth/logout?adminId=${adminId}`);
      if (response.data.success) {
        localStorage.removeItem('adminId');
        navigate('/admin/login', { replace: true });
        window.location.reload();
        setMessage('');
      }
      setMessage(response.data.message);
    } catch (error) {
      console.log('error in handleLogout adminNav', error);
      setMessage('server error');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: <Home /> },
    { id: 'Create Bunk', label: 'Create Bunk', path: '/admin/EvBunkPage', icon: <Book /> },
    { id: 'Booking List', label: 'Booking List', path: '/admin/bookingLists', icon: <Ticket /> },
    { id: 'Edit Bunk', label: 'Edit Bunk', path: '/admin/BunkDetailsAdmin', icon: <CreditCard /> },
   
  ];

  return (
    <>
      <button className="adminNavToggleBtn" onClick={() => setIsOpen((prev) => !prev)}>
  {isOpen ? (
    <X size={24} />
  ) : (
    <img src="\images\png-transparent-bmw-car-logo.png" alt="Open Sidebar" className="adminNavImageIcon" />
  )}
</button>
<p style={{color:"white"}}>{message}</p>


      {isOpen && (
        <nav className="adminNavContainer">
          <div className="adminNavLogo">
            <img
              style={{
                width: '60px',
                height: '60px',
                marginLeft: '83px',
                borderRadius: '30px',
              }}
              src="\images\png-transparent-bmw-car-logo.png"
              alt=""
            />
          </div>

          <ul className="adminNavList">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`adminNavItem ${activeItem === item.label ? 'adminNavItemActive' : ''}`}
                onClick={() => {
                  setActiveItem(item.label);
                  navigate(item.path);
                }}
              >
                <div className="adminNavIconContainer">{item.icon}</div>
                <span className="adminNavLabel">{item.label}</span>
                {activeItem === item.label && <div className="adminNavActiveIndicator" />}
              </li>
            ))}
          </ul>

          <div className="adminNavUserSection">
            <div className="adminNavUserAvatar">
              <span>{adminName.charAt(0)}</span>
            </div>
            <div className="adminNavUserInfo">
              <span className="adminNavUserName">{adminName }</span>
              <span className="adminNavUserRole">Admin</span>
            </div>
          </div>

          <button
            style={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '10px',
              padding: '10px 20px',
              border: '1px solid black',
              margin: '10px',
            }}
            onClick={() => setShowLogoutModal(true)}
          >
            LogOut
          </button>
        </nav>
      )}

      {showLogoutModal && (
        <div className="logoutModalOverlay">
          <div className="logoutModalBox">
            <h5>Are you sure you want to logout?</h5>
            <div className="logoutModalButtons">
              <button onClick={() => setShowLogoutModal(false)} className="logoutCancelBtn">
                Cancel
              </button>
              <button onClick={handleLogout} className="logoutConfirmBtn">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNav;
