import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom'
import logo from "../../stock/logo.png"
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { MdTrendingUp } from 'react-icons/md';
import { AiOutlineBank } from 'react-icons/ai';
import { BiWalletAlt } from 'react-icons/bi';
import { MdOutlineSettings } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";


function DesktopUserNav() {
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
                    <AiOutlineBank className='linkicon'/> <h3>Deposits</h3>
                </NavLink>

                <NavLink 
                    to='/withdrawals' 
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <BiWalletAlt className='linkicon'/> <h3>Withdrawals</h3>
                </NavLink>
                </div>


            <div className="user">
                <div className="icon"><p>K</p></div>
                <div className="username">Kipper</div>
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
  )
}

export default DesktopUserNav