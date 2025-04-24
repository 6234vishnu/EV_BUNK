import Lottie from 'lottie-react';
import '../../../assets/css/user/loginPage.css';
import animationData from '../../../assets/animations/Animation - 1745388982332.json';
import { useState,useEffect  } from 'react';
import api from '../../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const storeduser=localStorage.getItem("userId")
  const navigate=useNavigate()
  
useEffect(() => {
  if (storeduser) {
    navigate('/');
  }
}, [storeduser, navigate]);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false); 
  const [email, setEmail] = useState<string>('');
  const [password,setPassword]= useState<string>('');
  const [message,setMessage]=useState<string>("")
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
const [timer, setTimer] = useState(60);
const [timerExpired, setTimerExpired] = useState(false);
const [showOtpModal, setShowOtpModal] = useState(false);
const [enterPasswordModal,setEnterPasswordModal]=useState<boolean>(false)
const [newPassword,setNewPassword]=useState<string>("")
const [confirmPassword,setConfirmPassword]=useState<string>("")
const [otpFrombackend,setotpFrombackend]= useState<string>('');


  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const userLogin=async()=>{

    if(!email&&!password) return setMessage('Please enter Email and Password')
    try {
      const response=await api.post("/user/auth/login",{email,password})
      if(response.data.success){
        localStorage.setItem("userId",response.data.userId)
        return navigate("/")
      }
      return setMessage(response.data.message)
    } catch (error) {
      setMessage('server error try later')
      console.log("error in userLogin in login page")
    }
  }

  const handleForgotSubmit =async () => {
    if(!email) return setMessage('enter email before submission')
    setShowForgotModal(false);
    try {
      const response=await api.post('/user/auth/forgotEmail',{email})
      if(response.data.success){
        setShowOtpModal(true);
        setotpFrombackend(response.data.otp)
       
       
        return  
      }
      return setMessage(response.data.message)
      
    } catch (error) {
      setMessage('server error try later')
      console.log("error in handleForgotSubmit in login page")
    }
    
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  
  
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
        if (prev) {
          prev.focus();
        }
      } else {
        const updatedOtp = [...otp];
        updatedOtp[index] = '';
        setOtp(updatedOtp);
      }
    }
  };

  useEffect(() => {
    if (message) {
      const timeoutId = setTimeout(() => {
        setMessage('');
      }, 3000); 
      return () => clearTimeout(timeoutId); 
    }
  }, [message]);
  
  
  // Start timer on showOtpModal open
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
  
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
  
    if (timer === 0) {
      setTimerExpired(true);
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOtpModal, timer]);
  

  const handleOtpSubmit = () => {
    const enteredOtp = otp.join('');
    if(otpFrombackend!==enteredOtp) return setMessage("Enter correct OTP")
      setShowOtpModal(false)
    setEnterPasswordModal(true)
  };
  
  // Resend OTP
  const resendOtp = async () => {
    setTimer(60);
    setTimerExpired(false);
    // Call the same endpoint again
    await handleForgotSubmit(); 
  };

  const onClose=()=>{
    return setEnterPasswordModal(false)
  }

  const submitNewPassword=async()=>{
    if(!newPassword &&!confirmPassword )return  setMessage('fill all the feilds ')

    if(newPassword!==confirmPassword) return setMessage('passwords didint match')


    try {
      const response=await api.post("/user/auth/newPassword",{newPassword,email})
      if(response.data.success){
         localStorage.setItem('userId',response.data.userId)
         localStorage.removeItem("userOtp")
       return navigate("/")
      }
      localStorage.removeItem("userOtp")
      setMessage(response.data.message)
    } catch (error) {
      setMessage('server error try later')
     return console.log("error in submitNewPassword in login page")
    }
  }

  return (
   
    <>
      <div className='mainDivLoginPage'>
        <h3 className='mainH3TagLoginPage'>Login To</h3>
        <h1 className='mainH1TagLoginPage'>BMW</h1>

        <div className='animationContainer'>
          <Lottie animationData={animationData} loop autoplay />
        </div>
          <h5 style={{color:"red"}}>{message}</h5>
        {!showLoginForm ? (
          <button className='mainDivLoginButton' onClick={handleLoginClick}>
            LOGIN Here
          </button>
        ) : (
          <div className='loginFormContainer'>
            <input type="email" placeholder="Enter your email" className="inputField" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
            <input type="password" placeholder="Enter your password" className="inputField" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            <button onClick={userLogin} className="loginButton">Login</button>
            <a href="/SignUp">Are You A New User?</a>
            <a style={{ color: "grey", cursor: "pointer" }} onClick={() => setShowForgotModal(true)}>Forgot Password?</a>
          </div>
        )}
      </div>

      {showForgotModal && (
        <div className="forgotModalOverlay">
          <div className="forgotModal">
            <img src="\src\assets\images\png-transparent-bmw-car-logo.png" alt="Logo" className="forgotModalLogo" />
            <h3 style={{color:"black"}}>Reset Password</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="inputField"
              required
            />
            <h6 style={{color:"black"}}>NOTE: <strong>Check Your email</strong></h6>
            <div className="forgotModalButtons">
              <button onClick={handleForgotSubmit} className="loginButton">Get Otp</button>
              <button onClick={() => setShowForgotModal(false)} className="loginButton cancel">Close</button>
            </div>
          </div>
        </div>
      )}

{showOtpModal && (
  <div className="forgotModalOverlay">
    <div className="forgotModal">
      <img src="\src\assets\images\png-transparent-bmw-car-logo.png" alt="Logo" className="forgotModalLogo" />
      <h6 style={{color:"red"}}>{message}</h6>
      <h3 style={{color:"black"}}>Enter OTP</h3>

      <div className="otpInputsContainer">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            maxLength={1}
            className="otpInput"
            type="text"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
          />
        ))}
      </div>

      <h5 style={{color: "black"}}>Time Remaining: {timer}s</h5>

      <div className="forgotModalButtons">
        <button
          onClick={handleOtpSubmit}
          className="loginButton"
          disabled={timerExpired}
        >
          Submit OTP
        </button>
        <button onClick={() => setShowOtpModal(false)} className="loginButton cancel">Close</button>
      </div>

      {timerExpired && (
        <p style={{marginTop: "10px", color: "blue", cursor: "pointer"}} onClick={resendOtp}>
          Resend OTP
        </p>
      )}
    </div>
  </div>
)}

{enterPasswordModal &&(
   <div className="forgotModalOverlay">
   <div className="forgotModal">
     <img
       src="\src\assets\images\png-transparent-bmw-car-logo.png"
       alt="Logo"
       className="forgotModalLogo"
     />
     <h3 style={{ color: 'black' }}>Reset Password</h3>

     <input
       type="password"
       className="inputField"
       placeholder="Enter new password"
       value={newPassword}
       onChange={(e) => setNewPassword(e.target.value)}
       required
     />

     <input
       type="password"
       className="inputField"
       placeholder="Confirm new password"
       value={confirmPassword}
       onChange={(e) => setConfirmPassword(e.target.value)}
       required
     />

     {message && <p style={{ color: 'red' }}>{message}</p>}

     <div className="forgotModalButtons">
       <button onClick={submitNewPassword} className="loginButton">
         Submit
       </button>
       <button onClick={onClose} className="loginButton cancel">
         Cancel
       </button>
     </div>
   </div>
 </div>
)}
    </>
  );
}

export default LoginPage;
