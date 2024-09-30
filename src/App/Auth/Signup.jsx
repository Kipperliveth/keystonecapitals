import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { createUserWithEmailAndPassword, AuthErrorCodes, sendEmailVerification  } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { PiReadCvLogoFill } from "react-icons/pi";
import { ImSpinner8 } from "react-icons/im";
import { PuffLoader } from "react-spinners";
import {txtdb} from "../../firebase-config"
import logo from "../../stock/logo.png"
import { collection, addDoc } from "firebase/firestore";


function SignUp() {
  const navigate = useNavigate();

  const [registerEmail, setRegisterEmail] = useState("");
  // const [registerPassword, setRegisterPassword] = useState("");
  // //
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  //
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //subs
  const [status, setStatus] = useState('');

  const handleSubscribe = async (event) => {
    setStatus('Submitting...');
    
    try {
      // Add the email to the Firestore database
      await addDoc(collection(txtdb, 'subscribers'), { registerEmail });
      console.log('Subscription successful!');
    } catch (error) {
      console.error('Error adding email:', error);
      setStatus('Subscription failed. Please try again.');
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoggedIn(true);

    if (!password || !confirmPassword) {
      setIsLoggedIn(false);
      setError("Please fill in all fields");
    } else if (password !== confirmPassword) {
      setIsLoggedIn(false);
      setError("Passwords do not match");
    } else if (password.length < 6) {
      setIsLoggedIn(false);
      setError("Password should be at least 6 characters long");
    } else {
      setError("");
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          registerEmail,
          confirmPassword,
        );
        console.log(user);
        handleSubscribe();
        // const userCredentials = user.user
        // await sendEmailVerification(userCredentials);        
        await sendEmailVerification(user.user);
        navigate("/verify-account");
        setIsLoggedIn(false);
      } catch (error) {
        setIsLoggedIn(false);
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
          setError("Email is already in use");
          setIsLoggedIn(false);
        } else if (error.code === 'auth/invalid-email'){
          setIsLoggedIn(false);
          setError('Invalid Email')
        }
        console.log(error.message);
      }
    }
  };

  //loader
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Create Account-Keystone Capitals";

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, );

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="signup-page">
      {isLoading ? (
        <div className="spinner-container">
          <PuffLoader color=" #888" size={25} />
        </div>
      ) : (
        <div className="signup-page-container">
          <div className="sign-left">{/* <h1>Left</h1> */}</div>
          <div className="sign-right">
          <NavLink to='/' className="logo-container">
                <img src={logo} alt="keystonecapitals" />
                <div className="name"><h3>KEYSTONE</h3><p>CAPITALS</p></div>
                </NavLink>

            <div className="head">
              <h1>Get Started!</h1> <PiReadCvLogoFill className="sign-icon" />
            </div>
            <p className="head-p">INVEST. GROW. EXPLORE.</p>

            <form className="signup-form">
              <div className="emailnpassword">
                <h2>Email</h2>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  onChange={(event) => {
                    setRegisterEmail(event.target.value);
                  }}
                  required
                />
              </div>
              <div className="emailnpassword">
                <h2>Password</h2>
                <input
                  type="password"
                  placeholder="your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="emailnpassword">
                <h2>Re-enter Password</h2>
                <input
                  type="password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>

              <button onClick={handleSubmit} className="sign-up-btn">
                {isLoggedIn ? (
                  <ImSpinner8 className="signup-spinner" />
                ) : (
                  "Get Started"
                )}
              </button>
              {error && <p className="error-msg">{error}</p>}
              <p className="login-link">
                Already have an account? <NavLink to="/login">Login</NavLink>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
