import React, { useState, useEffect } from "react";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { ImSpinner8 } from "react-icons/im";
import { FaUser, FaCheckCircle, FaRocket } from "react-icons/fa"; // Animated icons

const auth = getAuth();

function Onboarding() {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!username) {
      setErrorMessage("Field cannot be empty");
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      setErrorMessage("Username must be at least 3 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName: username });
      console.log("Profile updated!");

      // Hide the input card and show the popup with the username
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle redirect logic or anything else
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) console.log("Not logged in"); // Redirect or handle as needed
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={styles.container}>
      {/* Input Card for Username */}
      {!showPopup && (
        <div style={styles.card}>
          <FaUser style={styles.icon} />
          <h2 style={styles.heading}>What should we call you?</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <button onClick={handleProfileUpdate} style={styles.button}>
            {isLoading ? <ImSpinner8 style={styles.spinner} /> : "Save Username"}
          </button>
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        </div>
      )}

      {/* Popup Component */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <FaCheckCircle style={styles.animatedIcon} className="bounce" />
            <h2 style={styles.popupHeading}>Welcome onboard, {username}!</h2>
            <p style={styles.popupText}>We are excited to have you with us!</p>
            <button style={styles.ctaButton}>
              <FaRocket style={styles.rocketIcon} /> Start Investing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'radial-gradient(circle farthest-corner at 10% 20%, rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90%)',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px', // Increased width
    marginBottom: '20px',
  },
  icon: {
    fontSize: '60px',
    color: '#6E44AE',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#4A2B8A',
    color: '#fff',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    marginTop: '10px',
    color: '#E74C3C',
    fontSize: '14px',
  },

  // Popup styles
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px', // Wider card for desktop
    width: '90%', // Responsive for mobile
  },
  popupHeading: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#6E44AE',
  },
  popupText: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#666',
  },
  ctaButton: {
    backgroundColor: '#4A2B8A',
    color: '#fff',
    padding: '14px 24px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex', // Changed from 'flex' to allow centering
    margin: '0 auto', // Center the button
    alignItems: 'center'
  },
  rocketIcon: {
    marginRight: '8px',
    fontSize: '20px',
  },
  animatedIcon: {
    fontSize: '60px',
    color: '#6E44AE',
    marginBottom: '20px',
    animation: 'bounce 1s infinite', // Add animation to the icon
  },

  // Animation for bounce effect
  '@keyframes bounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
};

export default Onboarding;
