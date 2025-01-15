import React, { useState } from 'react'
import logo from "../stock/logo.png"
import { NavLink, useLocation } from 'react-router-dom'
import { AiOutlineMenu } from "react-icons/ai"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HashLink } from 'react-router-hash-link';

function Navbar() {
    const [showMenu, setShowMenu] = useState(false)
    
    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

  const location = useLocation();

  
  const hiddenPaths = [
    "/login", "/signup", "/verify-account", "/verify-account/username", "/dashboard", '/investments', '/transactions', '/deposits', '/withdrawals', '/pendingDeposits'
  ];

  const shouldHideComponent = hiddenPaths.includes(location.pathname);

  return (
    <div style={{ display: shouldHideComponent ? "none" : "block" }}>
        <div className="navigation">
            <div className="navbar">
            <NavLink 
            to="/" 
            className="logo-container" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="keystonecapitals" />
            <div className="name">
              <h3>KEYSTONE</h3>
              <p>CAPITALS</p>
            </div>
          </NavLink>


                <div className="links">
                    {/* <li>
                     <NavLink  className={({ isActive }) =>
                  isActive ? "active-link" : "link"
                } to="/about">About</NavLink>
                    </li> */}
                    <li>
                    <HashLink  className={({ isActive }) =>
                  isActive ? "active-link" : "link"
                } smooth to="#how">How It Works</HashLink>
                    </li>
                    <li>
                    <HashLink  className={({ isActive }) =>
                  isActive ? "active-link" : "link"
                } smooth to="#tradables">Tradable Assets</HashLink>
                   </li>
                   <li>
                    <HashLink  className={({ isActive }) =>
                  isActive ? "active-link" : "link"
                } smooth to="#faqs">Faqs</HashLink>
                   </li>
                </div>

                <div className="start">
                    <NavLink to='/signup' className='desktop'>Register</NavLink>
                    <NavLink to='/login'>Sign in</NavLink>
                    {showMenu ? (
                <div>
                    <p onClick={toggleMenu} className='mobile'>X</p>
                </div>
                ) : (
                <AiOutlineMenu onClick={toggleMenu} className='mobile' />
                )}
                </div>
                
                {showMenu && (
                <div className="mobile-menu">
                   <NavLink>About Us <MdOutlineKeyboardArrowRight className='arrow'/></NavLink>
                   <NavLink>How It Works <MdOutlineKeyboardArrowRight className='arrow'/></NavLink>
                   <NavLink>Faqs <MdOutlineKeyboardArrowRight className='arrow'/></NavLink>
                   <NavLink>Get Help <MdOutlineKeyboardArrowRight className='arrow'/></NavLink>

                   <span></span>

                   <div className="start-mobile">
                    <NavLink to='/signup'>Register</NavLink>
                    <NavLink to='/login'>Sign in</NavLink>
                   </div>
                </div>
                )}


            </div>
        </div>
    </div>
  )
}

export default Navbar