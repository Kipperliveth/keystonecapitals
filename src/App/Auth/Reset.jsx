import React, {useState} from 'react'
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail  } from 'firebase/auth';
import { MdOutlineMail } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { ImSpinner8 } from "react-icons/im";


function PasswordReset() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState('')



  const handlePasswordReset = async (e) => {
    setIsLoggedIn(true);
    setMessage(false)
    setSuccessMessage(false);
    e.preventDefault();

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent to provided email');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code ===  "auth/missing-email") {
        setMessage('Email not registered. Please check your email address.');
      } else {
        console.error('Error sending password reset email:', error);
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsLoggedIn(false);
    }
  };


  return (
    <div className='reset-page'>
        
        <div className="reset-container">

            <div className="reset">

                <h2>Reset Password</h2>
                <p className='txt'>Enter the email address to your account and we'll send you a reset link to set a new password </p>

            <form onSubmit={handlePasswordReset}>
                <p className='head'>Email Address</p>
                <div className="email"><MdOutlineMail className='icon'/><input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                /></div>
                
                <button type="submit"> {isLoggedIn ? (
                  <ImSpinner8 className="login-spinner" />
                ) : (
                  "Send Email"
                )} </button>
            </form>
            {message && <p className='error'>{message}</p>}
            {successMessage && <p className='success'>{successMessage}</p>}
            <p className='remember'>Remember Password? <NavLink to='/login'>Login</NavLink></p>

            </div>
        </div>

    </div>
  )
}

export default PasswordReset