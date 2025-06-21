import React, { useEffect, useRef, useState } from "react";
import "../../../assets/css/admin/adminLogin.css";
import api from "../../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const AdminLoginPage: React.FC = () => {
  const adminId = localStorage.getItem("adminId");
  const navigate = useNavigate();

  useEffect(() => {
    if (adminId) {
      navigate("/admin/dashboard");
    }
  }, [adminId, navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordModal, setForgorPasswordModal] =
    useState<boolean>(false);
  const [enterOtpModal, setEnterOtpModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState<string>("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [backendOtp, setBackendotp] = useState<string>("");
  const [newPasswordModal, setNewpasswordModal] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState<number>(60);
  const [timerStopped, setTimerStopped] = useState<boolean>(false);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !password)
      return setMessage("Enter Email and Password to login");
    try {
      const response = await api.post("/admin/auth/login", { email, password });
      if (response.data.success) {
        localStorage.setItem("adminId", response.data.adminId);
        return navigate("/admin/dashboard");
      }
      return setMessage(response.data.message);
    } catch (error) {
      setMessage("server error");
    }
  };

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    if (enterOtpModal && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setTimerStopped(true);
    }

    return () => clearInterval(countdown);
  }, [enterOtpModal, timer]);

  const forgotPassword = async () => {
    if (!email) return setMessage("Please enter Email to continue");
    try {
      const response = await api.post("/admin/auth/forgotEmail", { email });
      if (response.data.success) {
        setTimer(60);
        setTimerStopped(false);

        setBackendotp(response.data.otp);
        setForgorPasswordModal(false);
        setEnterOtpModal(true);
        return;
      }
      return setMessage(response.data.message);
    } catch (error) {
      setMessage("server error");
    }
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };
  const handleChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) inputsRef.current[index + 1]?.focus();
    }
  };

  const sendOtp = () => {
    const enterdOtp = otp.join("");
    if (enterdOtp !== backendOtp) return setMessage("Enter correct OTP");
    setEnterOtpModal(false);
    return setNewpasswordModal(true);
  };

  const newPassword = async () => {
    if (!password && !confirmPassword)
      setMessage("Enter password and confirm password");
    if (password !== confirmPassword) setMessage("Password are not matched");
    try {
      const response = await api.post("/admin/auth/newPassword", {
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("adminId", response.data.adminId);
        navigate("/admin/dashboard");
      }
      setMessage(response.data.message);
    } catch (error) {
      setMessage("server error");
    }
  };

  return (
    <>
      <div className="adminLoginPage-container">
        <div className="adminLoginPage-wrapper">
          <div className="adminLoginPage-content">
            <div className="adminLoginPage-logoContainer">
              {/* BMW logo placeholder */}
              <div className="adminLoginPage-logo">
                <img
                  style={{ borderRadius: "80px" }}
                  src="\images\png-transparent-bmw-car-logo.png"
                  alt="BMW Logo"
                />
              </div>
            </div>

            <div className="adminLoginPage-formSide">
              <div className="adminLoginPage-formContainer">
                <h1 className="adminLoginPage-title">Admin Login</h1>
                <h6>{message}</h6>
                <p className="adminLoginPage-subtitle">
                  Enter your credentials to access the dashboard
                </p>

                <form onSubmit={handleSubmit} className="adminLoginPage-form">
                  <div className="adminLoginPage-inputGroup">
                    <input
                      type="email"
                      id="email"
                      className="adminLoginPage-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="adminLoginPage-inputGroup">
                    <input
                      type="password"
                      id="password"
                      className="adminLoginPage-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="adminLoginPage-options">
                    <a
                      onClick={() => setForgorPasswordModal(true)}
                      href="#"
                      className="adminLoginPage-forgotPassword"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button type="submit" className="adminLoginPage-button">
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {forgotPasswordModal && (
        <div className="adminLoginPage-forgotOverlay">
          <div className="adminLoginPage-forgotModal">
            <h2 style={{ color: "black" }}>Forgot Password</h2>
            <h6 style={{ color: "red" }}>{message}</h6>
            <p style={{ color: "black" }}>
              Please enter your email to reset your password.
            </p>
            <form onSubmit={forgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Send OTP</button>
            </form>
            <button
              className="adminLoginPage-closeBtn"
              onClick={() => setForgorPasswordModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {enterOtpModal && (
        <div className="otpModal-overlay">
          <div className="otpModal-container">
            <h2 style={{ color: "black" }}>Enter OTP</h2>
            <h6 style={{ color: "red" }}>{message}</h6>
            <div className="otpModal-inputWrapper">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otpModal-input"
                  required
                />
              ))}
            </div>
            <div className="otpModal-buttons">
              <button onClick={sendOtp} className="otpModal-submitBtn">
                Submit
              </button>
              <button
                onClick={() => setEnterOtpModal(false)}
                className="otpModal-closeBtn"
              >
                Close
              </button>
            </div>
            <div style={{ padding: "20px" }}>
              <h6 style={{ color: "black" }}>
                Time Remaining:{" "}
                <strong style={{ color: "red" }}>{timer}s</strong>
              </h6>
              {timerStopped && (
                <a
                  style={{ color: "black" }}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    forgotPassword(); // reuse your forgotPassword logic to resend OTP
                    setTimer(60);
                    setTimerStopped(false);
                  }}
                >
                  Resend OTP
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {newPasswordModal && (
        <div className="newPasswordModal-overlay">
          <div className="newPasswordModal-container">
            <h2 style={{ color: "black" }}>Set New Password</h2>
            <h6 style={{ color: "red" }}>{message}</h6>
            <input
              type="password"
              placeholder="New Password"
              className="newPasswordModal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="newPasswordModal-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="newPasswordModal-buttons">
              <button
                onClick={newPassword}
                className="newPasswordModal-submitBtn"
              >
                Submit
              </button>
              <button
                onClick={() => setNewpasswordModal(false)}
                className="newPasswordModal-closeBtn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLoginPage;
