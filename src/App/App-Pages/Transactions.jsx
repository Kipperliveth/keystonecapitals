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
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { txtdb } from '../../firebase-config';
import { auth } from '../../firebase-config';
import {
  onAuthStateChanged
} from "firebase/auth";
import { PiHandSwipeLeft } from "react-icons/pi";
import BitcoinChart from '../App-Components/BitcoinChart';

function Transactions() {
  const [user, setUser] = useState({});

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
    document.title= 'Transactions'
     document.addEventListener('mousedown', handleClickOutside);
     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, []);
 

    //transactions//
    const [transactions, setTransactions] = useState([]);
  
    const currentUser = auth.currentUser;

    const fetchTransactions = async () => {

      if(currentUser){

        const userId = currentUser.uid;
        const transactionsRef = collection(txtdb, "users", userId, "transactions");
  
        try {
          // Query the transactions, ordered by date (descending)
          const q = query(transactionsRef, orderBy("date", "desc"));
          const querySnapshot = await getDocs(q);
  
          // Map the query results into an array
          const transactionsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setTransactions(transactionsList); // Store transactions in state
        } catch (error) {
          console.error("Error fetching transactions: ", error);
        }
      }

    };


    useEffect(() => {
      fetchTransactions();
    }); 
  

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser || null); // Ensures `user` is set to null if `currentUser` is null
      });
    
      // Cleanup function to unsubscribe from the listener when component unmounts
      return () => unsubscribe();
    }, [auth]);



  return (
    <div className='layout'>
    <DesktopUserNav />

    <div className="content">

    <div className="transactions-container container" >

    <div className="navigation-container">

    <NavLink to='/dashboard' className="mobile">
              <img src={logo} alt="keystonecapitals" />
              <p className='name'>Transactions</p>
    </NavLink>


     <p className='desktop'>Transactions</p>

     <div className="actions desktop" >

     <div className="quick" onClick={handleToggleMenu} >
        Quick Actions 
        <IoIosArrowDown />

        {menuVisible && (
                        <div className="quick-actions" ref={menuRef}>

                        <NavLink to="/withdrawals" className="settings top">
                            <RiSendPlaneLine className='icon' /> Send Money
                        </NavLink>
    
                        <NavLink to="/investments" className="settings">
                            <MdFormatListBulletedAdd  className='icon' /> New Investment
                        </NavLink>
    
                        <NavLink to="/deposits" state={{ currentPage: "convert" }} className="settings">
                            <RiExchangeDollarLine  className='icon'/> Convert Funds
                        </NavLink>
    
                        <NavLink to="/deposits" className="logout">
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

    {transactions.length > 0 && (
  <p className='mobile'><PiHandSwipeLeft /> Swipe horizontally to see more details</p>
)}

    <div className="transaction-history">

    {transactions.length === 0 ? ( // Check if there are no transactions
          <div className='nothing-yet'>
            <BiTransfer className="icon" />
          <h4>No transactions yet</h4>  
          <BitcoinChart />
          <div className='info'>Once you make a payment or convert funds, <br /> the information appears here</div>
            </div>
        ) : (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Status</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })}</td>

              <td>${Number(transaction.amount).toLocaleString()}</td>

              <td>{transaction.description}</td>
              <td>{transaction.transactionStatus}</td>
              <td>{transaction.category}</td>

            </tr>
          ))}
        </tbody>
      </table>
        )}

        
    </div>
    </div>

    </div>



  </div>
  )
}

export default Transactions