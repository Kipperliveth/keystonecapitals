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
import { IoIosAdd } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import bitcoin from "../../stock/bitcoin-btc-logo.png"
import Eth from "../../stock/ethereum-eth-logo.png"
import USDT from "../../stock/tether-usdt-logo.png"
import sol from "../../stock/solana-sol-logo.png"
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";



function Deposits() {
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

  const [currentPage, setCurrentPage] = useState('add');


     
  return (
    <div className='layout'>
      <DesktopUserNav />

      <div className="content">

      <div className="deposit-container container" >

      <div className="navigation-container">

      <NavLink to='/dashboard' className="mobile">
                <img src={logo} alt="keystonecapitals" />
                <p className='name'>Deposits</p>
      </NavLink>


       <p className='desktop'>Deposits</p>

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

        <div className="deposits">

        <div className="add-convert">

          <div className="add-convert-container">

                <div className={currentPage === 'add' ? 'action' : 'action'} onClick={() => setCurrentPage('add')}><IoIosAdd /> Add Funds</div>
                <div className={currentPage === 'convert' ? 'action' : 'action'} onClick={() => setCurrentPage('convert')}><RiExchangeDollarLine />Convert Funds</div>
                <div className="action"><RiSendPlaneLine />Send Money</div>

          </div>

      {currentPage === 'add' && (
        <div className='add-funds'>
            
            <div className="wallet tab">

              <div className="switch-balance">

              <div className="switch">

            <div className="switch-container">

              <div className='asset'>
              <img src={bitcoin} alt="asset" />
              <p className='asset-name'>Ethereum</p>
              </div>

              <div className="switch-button">
                Switch <span> <MdKeyboardArrowUp /> <MdKeyboardArrowDown /> </span>
              </div>

              <div className="asset-selector">

                <div className="coin">
                  <img src={bitcoin} alt="bitcoin" />
                  <p className='coin-name'>Bitcoin</p>
                </div>
                <div className="coin">
                  <img src={Eth} alt="ethereum" />
                  <p className='coin-name'>Ethereum</p>
              </div>
              <div className="coin">
                  <img src={USDT} alt="tether" />
                  <p className='coin-name'>Tether</p>
              </div>
              <div className="coin">
                  <img src={sol} alt="solana" />
                  <p className='coin-name'>Solana</p>
              </div>

            </div>
            </div>

              </div>

              <div className="balance">

                <div className="account-balance">
                  $ 1.44
                </div>

                <p>Wallet balance <FaEye /></p>

              </div>

              </div>

              <NavLink>Invest Now <MdKeyboardArrowRight /> </NavLink>

            </div>

            <div className="details tab">

            </div>

            <div className="declaration tab">
              
            </div>


        </div>
    )}

  {currentPage === 'convert' && (
          <div className='convert-funds tab'> 
              convert
          </div>
      )}





        </div>

        </div>

      </div>

      </div>

    </div>
  )
}

export default Deposits