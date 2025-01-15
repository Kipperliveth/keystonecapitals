import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../../stock/logo.png"
import UserNav from '../App-Components/MobileUserNav';
import { BiTransfer } from "react-icons/bi";
import { collection, getDocs, query, orderBy, doc,setDoc, deleteDoc, increment, updateDoc } from "firebase/firestore";
import { txtdb } from '../../firebase-config';
import { auth } from '../../firebase-config';
import {
  onAuthStateChanged
} from "firebase/auth";
import { PiHandSwipeLeft } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

function PendingDeposits() {
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
        const transactionsRef = collection(txtdb, "pendingDeposits");
  
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


    //

    const authorizeDeposit = async (transaction) => {
      const assetBalanceRef = doc(txtdb, "users", transaction.userId, "balances", transaction.asset);
      const transactionRef = doc(txtdb, "users", transaction.userId, "transactions", transaction.transactionId);
      
      try {
        await setDoc(assetBalanceRef, { balance: increment(transaction.amount) }, { merge: true });
        await updateDoc(transactionRef, { transactionStatus: "Successful" });
        await deleteDoc(doc(txtdb, "pendingDeposits", transaction.id));
        alert("Deposit authorized and added to balance.");
        fetchTransactions();
      } catch (error) {
        console.error("Error authorizing deposit:", error);
      }
    };
    

    
    const declineDeposit = async (transaction) => {
      const transactionRef = doc(txtdb, "users", transaction.userId, "transactions", transaction.transactionId);
      
      try {
        await updateDoc(transactionRef, { transactionStatus: "Declined" });
        await deleteDoc(doc(txtdb, "pendingDeposits", transaction.id));
        alert("Deposit declined.");
        fetchTransactions();
      } catch (error) {
        console.error("Error declining deposit:", error);
      }
    };
    
    
    
    

  return (
    <div className='layout admin'>
    {/* <DesktopUserNav /> */}

    <div className="content">

    <div className="transactions-container container" >

    <div className="navigation-container">

    <NavLink to='/dashboard' className="mobile">
              <img src={logo} alt="keystonecapitals" />
              <p className='name'>Pending Deposits</p>
    </NavLink>


     <p className='desktop'>Pending Deposits</p>

     <div className="actions desktop" >

     <div className="quick" onClick={handleToggleMenu} >
       Sign Out
        <IoIosLogOut />
        </div>

     <div className="notif">
     <MdOutlineAdminPanelSettings className='icon' title='Admin' />
     </div>
     </div>

     <div className="actions mobile">

     <div className="notif">
     <MdOutlineAdminPanelSettings className='icon' title='Admin' />

     </div>

     <div className="nav"  onClick={handleNavClick}>
     <IoIosLogOut className='icon' />
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
          <h4>No Pending Deposits yet</h4>  
          <div className='info'>Once you make a payment or convert funds, <br /> the information appears here</div>
            </div>
        ) : (
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Authorize/Decline</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.username}</td>
              <td>{new Date(transaction.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })}</td>

              <td>${Number(transaction.amount).toLocaleString()}</td>
              <td>{transaction.transactionStatus}</td>

              <td className='validate'>
                <button className='decline'  onClick={() => declineDeposit(transaction.id)}>Decline</button> 
                <button className='Authorize' onClick={() => authorizeDeposit(transaction)}>Authorize</button></td>

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

export default PendingDeposits;