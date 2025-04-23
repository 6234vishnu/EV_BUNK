import Lottie from 'lottie-react';
import '../../../assets/css/user/loginPage.css';
import animationData from '../../../assets/animations/Animation - 1745388982332.json';
import { useState } from 'react';

function LoginPage() {
    const [showLoginForm, setShowLoginForm] = useState(false); 

    const handleLoginClick = () => {
        setShowLoginForm(true); 
    };

    return (
        <>
          <div className='mainDivLoginPage'>
            <h3 className='mainH3TagLoginPage'>
                Login To
            </h3>
            <h1 className='mainH1TagLoginPage'> TATA MOTORS</h1>
    
            <div className='animationContainer'>
              <Lottie animationData={animationData} loop autoplay />
            </div>
    
            {!showLoginForm ? (
              <button
                className='mainDivLoginButton'
                onClick={handleLoginClick} // Handle click to show the form
              >
                LOGIN Here
              </button>
            ) : (
              <div className='loginFormContainer'>
                <input type="email" placeholder="Enter your email" className="inputField" />
                <input type="password" placeholder="Enter your password" className="inputField" />
                <button className="loginButton">Login</button>
                <a href="/SignUp">Are You A New User?</a>
                <a style={{color:"grey"}} href="#">Forgot Password ?</a>
              </div>
            )}
          </div>
        </>
    );
}

export default LoginPage;
