import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom'
import logo from "../../stock/logo.png"
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { MdTrendingUp } from 'react-icons/md';
import { BiWalletAlt } from 'react-icons/bi';
import { MdOutlineSettings } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { RiSendPlaneLine } from "react-icons/ri";
import {
    onAuthStateChanged,
    signOut,
  } from "firebase/auth";
import { auth } from '../../firebase-config';

function DesktopUserNav() {
  const [user, setUser] = useState({});

    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);

      // Toggle menu visibility when button is clicked
  const handleToggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Close the menu when clicking outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is logged in:", currentUser);
        setUser(currentUser);
        
      } else {
        console.log("No user is logged in.");
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login"; // Redirect to login or home page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (

    <div className='DesktopUserNav'>

        <div className="DesktopUserNav-container">

           <NavLink to='/dashboard' className="logo-container">
                <img src={logo} alt="keystonecapitals" />
                <div className="name"><h3>KEYSTONE</h3><p>CAPITALS</p></div>
            </NavLink>

            <div className="links">
                <NavLink 
                    to='/dashboard' 
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <MdOutlineDashboard className='linkicon'/> <h3>Dashboard</h3>
                </NavLink>
                
                <NavLink 
                    to='/investments' 
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <MdTrendingUp className='linkicon'/> <h3>Investments</h3>
                </NavLink>

                <NavLink 
                    to='/transactions' 
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <BiTransfer className='linkicon'/> <h3>Transactions</h3>
                </NavLink>

                <NavLink 
                    to='/deposits' 
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <IoWalletOutline className='linkicon'/> <h3>Deposits</h3>
                </NavLink>

                <NavLink 
                    to='/withdrawals' 
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <RiSendPlaneLine className='linkicon'/> <h3>Withdrawals</h3>
                </NavLink>
                </div>


            <div className="user">
                <div className="icon"><p>{user.displayName ? user.displayName.charAt(0).toUpperCase() : ""}</p></div>
                <div className="username">{user.displayName}</div>
                <HiOutlineDotsHorizontal className='options' onClick={handleToggleMenu}/>

                {menuVisible && (
                    <div className="settings-logout" ref={menuRef}>
                    <NavLink className="settings">
                        <MdOutlineSettings /> Settings
                    </NavLink>
                    <div className="logout" onClick={handleLogout}>
                        <MdOutlineLogout /> Logout
                    </div>
                    </div>
                )}
            </div>

        </div>


     </div>
  )
}

export default DesktopUserNav