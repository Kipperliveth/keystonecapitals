import {
    signInWithEmailAndPassword, sendEmailVerification
  } from "firebase/auth";
  import React, { useState, useEffect} from "react";
  import logo from "../../stock/logo.png"
  import { NavLink } from "react-router-dom";
  import { auth } from "../../firebase-config";
  import { useNavigate } from "react-router-dom";
  import { PiHandWavingFill } from "react-icons/pi";
  import { ImSpinner8 } from "react-icons/im";
  import { PuffLoader } from "react-spinners";
   
  
  function Login() {
    //error state
    const [errorMessage, setErrorMessage] = useState("");
    //
    const navigate = useNavigate();
  
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
  
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState("");
  
    const allowedUid = "ADQf0ZCM8rRHt99PV4IG8vcYMxr2";
    const login = async (event) => {
      event.preventDefault();
      setIsLoggedIn(true);
    
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          loginEmail,
          loginPassword
        );
        const user = userCredential.user;
        setIsLoggedIn(false);
    
        if (user.emailVerified) {
          console.log("Sign in successful!");
    
          // Check if the user has admin access
          if (user.uid === allowedUid) {
            console.log("Admin access!");
            setError(false);
            navigate('/adminHome');
          } else {
            console.log("Customer access!");
            navigate("/dashboard");
          }
    
        } else {
          // setError("Please verify your email first.")
          await sendEmailVerification(user)
          // console.log(user.user, user, "hey")
          navigate('/verify-account')
          console.log('email not verified')
          setIsLoggedIn(false)
        }
    
      } catch (error) {
        setIsLoggedIn(false);
        
        if (error.code === 'auth/invalid-credential') {
          setError('Invalid email or password');
        } else if (error.code === 'auth/user-not-found') {
         setError('User not found. Please check your email.');
        } else if (error.code === 'auth/network-request-failed') {
          setError('Network Error');
        } else {
          // console.log(`Error: ${error.message}`);
        }


      }
    };
    
  
  
  
  // useEffect(() => {
  //   const fetchAddressData = async (user) => {
  //     const userId = user.uid;
  //     const userRef = doc(collection(txtdb, "users"), userId);
  //     const userSnap = await getDoc(userRef);
  //     if (userSnap.exists()) {
  //       const userData = userSnap.data();
  //       if (userData.address && userId === allowedUid) {
  //         navigate('/adminHome'); // Redirect to admin home if address exists and user is admin
  //       } else if (userData.address) {
  //         navigate('/merch'); // Redirect to user dashboard if address exists
  //       } else {
  //         navigate('/onboarding/address'); // Redirect to onboarding if address doesn't exist
  //       }
  //     } else {
  //       console.log("No address data found for the current user.");
  //       navigate('/onboarding/address');
  //     }
  //   };
  
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       await fetchAddressData(user);
  //     } else {
  //       console.log("No authenticated user found.");
  //     }
  //   });
  
  //   return () => unsubscribe(); // Clean up the subscription
  // }, [navigate, allowedUid]); 
  
    //loader
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      document.title = "Login-Keystone Capitals";
  
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, );
  
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className="login-page">
        {isLoading ? (
          <div className="spinner-container">
            <PuffLoader color=" #888" size={25} />
          </div>
        ) : (
          <div className="login-page-container">
            <div className="login-left">

            <NavLink to='/' className="logo-container">
                <img src={logo} alt="keystonecapitals" />
                <div className="name"><h3>KEYSTONE</h3><p>CAPITALS</p></div>
                </NavLink>

              <h1>
                Welcome Back! <PiHandWavingFill className="wave-icon" />
              </h1>
              <p className="loginP">Enter login details to continue investing</p>
           
  
              <form className="login-form">
                <div className="emailnpassword">
                  <h2>Email</h2>
                  <input
                    className="email-input"
                    type="email"
                    placeholder="Enter your email"
                    onChange={(event) => {
                      setLoginEmail(event.target.value);
                    }}
                    required
                  />
                </div>
                <div className="emailnpassword">
                  <h2>Password</h2>
                  <input
                    type="password"
                    placeholder="your password"
                    onChange={(event) => {
                      setLoginPassword(event.target.value);
                    }}
                    required
                  />
                </div>
  
                <div className="forgot-pass">
                  <NavLink to='/reset'>Forgot password?</NavLink>
                </div>
  
                <button onClick={login} className="login-btn" disabled={isLoggedIn}>
                {isLoggedIn ? (
                  <ImSpinner8 className="login-spinner" />
                ) : (
                  "Sign In"
                )}
              </button>

  
                 {/* {error && (
                  <p className="passcheck">{`invalid email or password`}</p>
                )} */}

                {error && <p className="passcheck">{error}</p>}
   
                {errorMessage && <p className="passcheck" style={{ color: "red", fontWeight: 500}}>{errorMessage}</p>}
  
                <p className="sign-up-link">
                  Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
                </p>
              </form>
            </div>
  
            <div className="login-right"></div>
          </div>
        )}
      </div>
    );
  }
  
  export default Login;
  