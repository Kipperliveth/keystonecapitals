import React, { useState } from 'react';
import { FaCheckCircle, FaEnvelopeOpenText } from 'react-icons/fa';
import { auth } from '../../firebase-config'; // Firebase config
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';

function OTP({ email }) {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerificationCheck = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      setStatus('User not logged in');
      return;
    }
  
    setChecking(true);
    
    await user.reload();
    
    if (user.emailVerified) {
      navigate('/verify-account/username');
    } else {
      setStatus('Account not verified');
      setTimeout(() => setStatus(''), 5000);
    }
  
    setChecking(false);
  };
  
  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser; // Get the currently logged-in user
      if (user) {
        await sendEmailVerification(user); // Resend verification email
        setMessage('Verification email has been resent. Please check your inbox.');
      } else {
        setMessage('You must be logged in to resend the verification email.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <FaEnvelopeOpenText style={styles.icon} />
        <h1 style={styles.heading}>Verify Your Account</h1>
        <p style={styles.text}>
          A verification link has been sent to <strong>{email}</strong>. Please check your email and click the link to complete your registration.
        </p>
        <a href={`mailto:${email}`} style={styles.button}>
          <FaCheckCircle style={{ marginRight: '8px' }} /> Open Email App
        </a>

        <button onClick={handleVerificationCheck} style={styles.verifyButton} disabled={checking}>
          {checking ? 'Checking...' : 'Check Verification'}
        </button>

        {status && <p style={styles.statusMessage}>{status}</p>}

        <p style={styles.resend} onClick={handleResendVerification}>
          Didn't receive an email? <a href="" style={styles.link}>Resend Verification Link</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'radial-gradient( circle farthest-corner at 10% 20%, rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90%)',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  icon: {
    fontSize: '60px',
    color: '#6E44AE',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  text: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#666',
  },
  button: {
    backgroundColor: '#6E44AE',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
  },
  verifyButton: {
    backgroundColor: '#4A2B8A',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    display: 'block',
    width: '100%',
  },
  statusMessage: {
    marginTop: '10px',
    color: '#E74C3C',
    fontSize: '14px',
  },
  resend: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#777',
  },
  link: {
    color: '#6E44AE',
    textDecoration: 'none',
  },
};

export default OTP;
