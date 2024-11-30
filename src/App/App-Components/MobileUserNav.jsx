import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { MdTrendingUp } from 'react-icons/md';
import { AiOutlineBank } from 'react-icons/ai';
import { BiWalletAlt } from 'react-icons/bi';
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { RiExchangeDollarLine } from "react-icons/ri";
import { RiSendPlaneLine } from "react-icons/ri";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from '../../firebase-config';

function UserNav({ onClose }) {
  const [user, setUser] = useState({});

  const [menuVisible, setMenuVisible] = useState(false);
  const [quickMenuVisible, setQuickMenuVisible] = useState(false); // New state for quick actions menu
  const menuRef = useRef(null);
  const quickMenuRef = useRef(null); // Ref for quick actions menu

  // Toggle menu visibility when button is clicked
  const handleToggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Toggle quick actions menu visibility when button is clicked
  const handleToggleQuickMenu = () => {
    setQuickMenuVisible(!quickMenuVisible);
  };

  // Close the menus when clicking outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
    if (quickMenuRef.current && !quickMenuRef.current.contains(event.target)) {
      setQuickMenuVisible(false);
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

  return (
    <div>
        <div className="side-bar">
          <div className="sidebar-container">

            <div className="side-actions">

              <div className="close-actions">
                <div className="close">
                  <IoCloseOutline className='closeIcon' onClick={onClose} />
                </div>
                <div className="quick" onClick={handleToggleQuickMenu} >
        Quick Actions 
        <IoIosArrowDown />

        {quickMenuVisible && (
                 <div className="quick-actions" ref={quickMenuRef}>

                    <NavLink className="settings top">
                        <RiSendPlaneLine className='icon' /> Send Money
                    </NavLink>

                    <NavLink className="settings">
                        <MdFormatListBulletedAdd  className='icon' /> New Investment
                    </NavLink>

                    <NavLink className="settings">
                        <RiExchangeDollarLine  className='icon'/> Convert Funds
                    </NavLink>

                    <NavLink className="logout">
                        <IoWalletOutline  className='icon' /> Fund Wallet
                    </NavLink>

                    </div>
                )}
        </div>

              </div>

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
            </div>


            <div className="user">
                <div className="icon"><p>{user.displayName ? user.displayName.charAt(0).toUpperCase() : ""}</p></div>
                <div className="username"> {user.displayName}</div>
                <HiOutlineDotsHorizontal className='options' onClick={handleToggleMenu}/>

                {menuVisible && (
                    <div className="settings-logout" ref={menuRef}>
                    <NavLink className="settings">
                        <MdOutlineSettings /> Settings
                    </NavLink>
                    <div className="logout">
                        <MdOutlineLogout /> Logout
                    </div>
                    </div>
                )}
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserNav