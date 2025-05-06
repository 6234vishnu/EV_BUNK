import Lottie from "lottie-react";
import "../../../assets/css/user/signUpPage.css";
import animationData from "../../../assets/animations/Animation - 1745402483754 (2).json";
import { useState } from "react";
import api from "../../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

interface signupForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const [showSignupForm, setShowSignupForm] = useState<boolean>(false);
  const [otpFromBackend, setOtpFromBackend] = useState<string>("");
  const [enterdOtp, setEnterdOtp] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [formdata, setFormData] = useState<signupForm>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSignupClick = (): void => {
    setShowSignupForm(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e: any) => {
    e.preventDefault();
    if (formdata.password !== formdata.confirmPassword) {
      return setMessage("Passwords didint macth try again");
    }
    if (
      !formdata.fullName &&
      !formdata.email &&
      !formdata.phone &&
      !formdata.password &&
      !formdata.confirmPassword
    ) {
      return setMessage("fill all the fields before submission");
    }

    try {
      const response = await api.post("/user/auth/signUp", { formdata });
      if (response.data.success) {
        return setOtpFromBackend(response.data.otp);
      }
      setMessage(response.data.message);
    } catch (error) {
      console.log("error in handleSignupSubmit in signup Page", error);

      setMessage("server error try later");
    }
  };

  const sendOtp = async (e: any) => {
    e.preventDefault();
    if (!enterdOtp) return setMessage("Please enter otp before submission");
    try {
      const response = await api.post("/user/auth/submitOtp", {
        enterdOtp,
        otpFromBackend,
        ...formdata,
      });
      if (response.data.success) {
        setOtpFromBackend("");
        localStorage.setItem("userId", response.data.userId);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);

          navigate("/");
        }, 2000);

        return;
      }
      return setMessage(response.data.message);
    } catch (error) {
      setMessage("server error");
      console.log("error in sendotp in signup page", error);
    }
  };

  return (
    <>
      <div className="mainDivSignUpPage">
        <h3 className="mainH3TagSignUpPage">Create Account On</h3>
        <h1 className="mainH1TagSignUpPage">BMW</h1>

        <div className="animationContainer">
          <Lottie animationData={animationData} loop autoplay />
        </div>

        {!showSignupForm ? (
          <button className="mainDivSignUpButton" onClick={handleSignupClick}>
            SIGNUP Here
          </button>
        ) : (
          <form className="signUpFormContainer" onSubmit={handleSignupSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="inputField"
              required
              value={formdata.fullName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="inputField"
              required
              value={formdata.email}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="inputField"
              required
              value={formdata.phone}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              className="inputField"
              required
              value={formdata.password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="inputField"
              required
              value={formdata.confirmPassword}
              onChange={handleInputChange}
            />
            <button type="submit" className="signUpButton">
              Sign Up
            </button>
            <h5 style={{ color: "red" }}>{message}</h5>
            <a href="/login" className="loginRedirect">
              Already have an account? Login
            </a>
          </form>
        )}
      </div>
      {otpFromBackend && (
        <div className="otpModalOverlay">
          <div className="otpModal">
            <h3>Enter OTP sent to your email</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              className="otpInput"
              maxLength={6}
              value={enterdOtp}
              onChange={(e) => setEnterdOtp(e.target.value)}
              required
            />
            <div className="otpButtonGroup">
              <button className="otpSubmitBtn" onClick={sendOtp}>
                Submit
              </button>
              <button className="otpCloseBtn">Close</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="signupSuccessOverlay">
          <div className="signupSuccessModal">
            <img
              src="\images\png-transparent-bmw-car-logo.png" // adjust path based on your project
              alt="Logo"
              className="signupSuccessLogo"
            />
            <h3 className="signupSuccessTitle"> Signup Successful!</h3>
            <p className="signupSuccessText">
              You can now log in to your account.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
