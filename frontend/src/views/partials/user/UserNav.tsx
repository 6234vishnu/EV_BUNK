import React, { useEffect, useState } from "react";
import {
  Home,
  User,
  Calendar,
  CreditCard,
  X,
  Menu,
  ClipboardList,
  LogOut,
} from "lucide-react";
import "../../../assets/css/partials/user/navBar.css";
import { useNavigate } from "react-router-dom";
import api from "../../../services/axiosInstance";

const UserNav = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setMessage("Couldn't find any user. Please log in first.");
      return;
    }

    const getUserData = async () => {
      try {
        const response = await api.get(
          `/user/profile/getDetails?userId=${userId}`
        );
        if (response.data.success) {
          setUserName(response.data.user?.name);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.log("Error in user sidebar:", error);
        setMessage("Server error, try again later");
      }
    };

    getUserData();
  }, [userId]);

  const handleLogout = async () => {
    try {
      const response = await api.post(`/user/auth/logout?userId=${userId}`);
      if (response.data.success) {
        localStorage.removeItem("userId");
        navigate("/login", { replace: true });
        window.location.reload();
        setMessage("");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log("Error in handleLogout userNav:", error);
      setMessage("Server error");
    }
  };

  const navItems = [
    { id: "home", label: "Home", path: "/", icon: <Home /> },
    {
      id: "Booking a bunk",
      label: "Booking a bunk",
      path: "/user/BunkList",
      icon: <Calendar />,
    },
    { id: "profile", label: "Profile", path: "/user/profile", icon: <User /> },
    {
      id: "Latest Arrivals",
      label: "Latest Arrivals",
      path: "/user/latestCars",
      icon: <CreditCard />,
    },
    {
      id: "support-Terms",
      label: "support-Terms",
      path: "/user/Terms-Conditions",
      icon: <ClipboardList />,
    },
  ];

  return (
    <>
      <button
        className="userNavToggleBtn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <img
            src="\images\png-transparent-bmw-car-logo.png"
            alt="Open Sidebar"
            className="userNavImageIcon"
          />
        )}
      </button>

      <p style={{ color: "white" }}>{message}</p>

      {isOpen && (
        <nav className="userNavContainer">
          <div className="userNavLogo">
            <img
              style={{
                width: "60px",
                height: "60px",
                marginLeft: "83px",
                borderRadius: "30px",
              }}
              src="\images\png-transparent-bmw-car-logo.png"
              alt="User Icon"
            />
          </div>

          <ul className="userNavList">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`userNavItem ${
                  activeItem === item.label ? "userNavItemActive" : ""
                }`}
                onClick={() => {
                  setActiveItem(item.label);
                  navigate(item.path);
                }}
              >
                <div className="userNavIconContainer">{item.icon}</div>
                <span className="userNavLabel">{item.label}</span>
                {activeItem === item.label && (
                  <div className="userNavActiveIndicator" />
                )}
              </li>
            ))}
          </ul>

          <div className="userNavUserSection">
            <div className="userNavUserAvatar">
              <span>{userName.charAt(0)}</span>
            </div>
            <div className="userNavUserInfo">
              <span className="userNavUserName">{userName}</span>
              
            </div>
          </div>

          {userId&&(
            <button
            style={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "10px",
              padding: "10px 20px",
              border: "1px solid black",
              margin: "10px",
            }}
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut style={{ marginRight: "8px" }} size={16} />
            LogOut
          </button>
          )}
        </nav>
      )}

      {showLogoutModal && (
        <div className="logoutModalOverlay">
          <div className="logoutModalBox">
            <h5>Are you sure you want to logout?</h5>
            <div className="logoutModalButtons">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="logoutCancelBtn"
              >
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

export default UserNav;
