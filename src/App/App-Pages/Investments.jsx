import React, { useState, useEffect, useRef } from 'react';
import DesktopUserNav from '../App-Components/DesktopUserNav'
import { IoIosArrowDown } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import logo from "../../stock/logo.png"
import { CgMenuLeft } from "react-icons/cg";
import UserNav from '../App-Components/MobileUserNav';
import { RiExchangeDollarLine } from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";
import { RiSendPlaneLine } from "react-icons/ri";
import { MdFormatListBulletedAdd } from "react-icons/md";

function Investments() {
     // State to track if the sidebar is visible
     const [isSidebarVisible, setIsSidebarVisible] = useState(false);

     // Function to handle the click event
     const handleNavClick = () => {
       setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
     };
 
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
    <div className='layout'>
    <DesktopUserNav />

    <div className="content">

    <div className="investments-container container" >

    <div className="navigation-container">

    <NavLink to='/dashboard' className="mobile">
              <img src={logo} alt="keystonecapitals" />
              <p className='name'>Investments</p>
    </NavLink>


     <p className='desktop'>Investments</p>

     <div className="actions desktop" >

     <div className="quick" onClick={handleToggleMenu} >
        Quick Actions 
        <IoIosArrowDown />

        {menuVisible && (
                 <div className="quick-actions" ref={menuRef}>

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
                        <BiTransfer  className='icon' /> Fund Wallet
                    </NavLink>

                    </div>
                )}
        </div>

     <div className="notif">
     <MdNotificationsNone className='icon' />
     </div>
     </div>

     <div className="actions mobile">

     <div className="notif">
     <MdNotificationsNone className='icon' />
     </div>

     <div className="nav"  onClick={handleNavClick}>
     <CgMenuLeft className='icon' />
     </div>

     </div>

    </div>

    {isSidebarVisible && (
      <UserNav onClose={handleNavClick} />
    )}

    </div>

    <div className="pages-content">

        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis dolore a, neque beatae libero facilis debitis nostrum. Doloremque rem nobis quidem placeat ab hic dolorem asperiores. Totam vero ab nam!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis dolore a, neque beatae libero facilis debitis nostrum. Doloremque rem nobis quidem placeat ab hic dolorem asperiores. Totam vero ab nam!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis dolore a, neque beatae libero facilis debitis nostrum. Doloremque rem nobis quidem placeat ab hic dolorem asperiores. Totam vero ab nam!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis dolore a, neque beatae libero facilis debitis nostrum. Doloremque rem nobis quidem placeat ab hic dolorem asperiores. Totam vero ab nam!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis dolore a, neque beatae libero facilis debitis nostrum. Doloremque rem nobis quidem placeat ab hic dolorem asperiores. Totam vero ab nam!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis dolore a, neque beatae libero facilis debitis nostrum. Doloremque rem nobis quidem placeat ab hic dolorem asperiores. Totam vero ab nam!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis dolore a, neque beatae libero facilis debitis nostrum. Doloremque rem nobis quidem placeat ab hic dolorem asperiores. Totam vero ab nam!
    </div>



    </div>

  </div>
  )
}

export default Investments