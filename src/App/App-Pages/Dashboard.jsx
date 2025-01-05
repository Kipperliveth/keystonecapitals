import React, { useState, useEffect, useRef } from 'react';
import DesktopUserNav from '../App-Components/DesktopUserNav'
import { IoIosArrowDown } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import logo from "../../stock/logo.png"
import { CgMenuLeft } from "react-icons/cg";
import UserNav from '../App-Components/MobileUserNav';
import purse from '../../stock/purse.png'
import bitcoin from "../../stock/bitcoin-btc-logo.png"
import Eth from "../../stock/ethereum-eth-logo.png"
import USDT from "../../stock/tether-usdt-logo.png"
import sol from "../../stock/solana-sol-logo.png"

import { RiExchangeDollarLine } from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";
import { RiSendPlaneLine } from "react-icons/ri";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { auth, txtdb } from '../../firebase-config';
import { doc, collection, getDoc } from "firebase/firestore";
import { getDocs, query, orderBy } from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";
import { IoIosArrowForward } from "react-icons/io";


function Dashboard() {

  const [user, setUser] = useState({});


    // State to track if the sidebar is visible
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    // Function to handle the click event
    const handleNavClick = () => {
      setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
    };

    //

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


  //balances\
  
//eth balance
  const [ethereumBalance, setEthereumBalance] = useState(null);

    const currentUser = auth.currentUser;
    const fetchEthereumBalance = async () => {

      if(currentUser){
        const userId = currentUser.uid;
        const ethBalanceRef = doc(txtdb, "users", userId, "balances", "Ethereum");
  
        try {
          const docSnap = await getDoc(ethBalanceRef);
  
          if (docSnap.exists()) {
            setEthereumBalance(docSnap.data().balance || 0);
          } else {
            setEthereumBalance(0); // Asset balance does not exist
          }
        } catch (error) {
          console.error("Error fetching Ethereum balance:", error);
        } 
      };

      }

 //btc balance
 
 const [bitcoinBalance, setBitcoinBalance] = useState(null);

    const fetchBitcoinBalance = async () => {

      if(currentUser){
        const userId = currentUser.uid;
        const ethBalanceRef = doc(txtdb, "users", userId, "balances", "Bitcoin");
  
        try {
          const docSnap = await getDoc(ethBalanceRef);
  
          if (docSnap.exists()) {
            setBitcoinBalance(docSnap.data().balance || 0);
          } else {
            setBitcoinBalance(0); // Asset balance does not exist
          }
        } catch (error) {
          console.error("Error fetching Bitcoin balance:", error);
        } 
      };

      }
   
  //usdt balance
  
  const [usdtBalance, setUsdtBalance] = useState(null);

  const fetchUsdtBalance = async () => {

    if(currentUser){
      const userId = currentUser.uid;
      const ethBalanceRef = doc(txtdb, "users", userId, "balances", "USDT");

      try {
        const docSnap = await getDoc(ethBalanceRef);

        if (docSnap.exists()) {
          setUsdtBalance(docSnap.data().balance || 0);
        } else {
          setUsdtBalance(0); // Asset balance does not exist
        }
      } catch (error) {
        console.error("Error fetching USDT balance:", error);
      } 
    };

    }


  //sol balance
  
  const [solBalance, setSolBalance] = useState(null);

  const fetchSolBalance = async () => {

    if(currentUser){
      const userId = currentUser.uid;
      const ethBalanceRef = doc(txtdb, "users", userId, "balances", "Solana");

      try {
        const docSnap = await getDoc(ethBalanceRef);

        if (docSnap.exists()) {
          setSolBalance(docSnap.data().balance || 0);
        } else {
          setSolBalance(0); // Asset balance does not exist
        }
      } catch (error) {
        console.error("Error fetching Solana balance:", error);
      } 
    };

    }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null); // Ensures `user` is set to null if `currentUser` is null
    });
  
    // Cleanup function to unsubscribe from the listener when component unmounts
    return () => unsubscribe();
  }, [auth]);


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

  useEffect(() =>{
    document.title= "Dashboard"
    fetchEthereumBalance();
    fetchBitcoinBalance();
    fetchUsdtBalance();
    fetchSolBalance();
  })


  //fetching value

  //btc
  const [exchangeRate, setExchangeRate] = useState(null); // To store BTC-USD rate
  const [btcValue, setBtcValue] = useState(null); // To store calculated BTC value

  useEffect(() => {
    // Fetch BTC to USD exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = await response.json();
        setExchangeRate(data.bitcoin.usd); // Set the BTC-USD rate
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  // Calculate the BTC value when bitcoinBalance or exchangeRate changes
  useEffect(() => {
    if (exchangeRate !== null && bitcoinBalance !== null) {
      setBtcValue((bitcoinBalance / exchangeRate).toFixed(8)); // Calculate BTC value and format to 8 decimals
    }
  }, [exchangeRate, bitcoinBalance]);


  //eth
  const [ethExchangeRate, setEthExchangeRate] = useState(null); // To store ETH-USD rate
  const [ethValue, setEthValue] = useState(null); // To store calculated ETH value

  useEffect(() => {
    // Fetch ETH to USD exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setEthExchangeRate(data.ethereum.usd); // Set the ETH-USD rate
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  // Calculate the ETH value when ethereumBalance or exchangeRate changes
  useEffect(() => {
    if (ethExchangeRate !== null && ethereumBalance !== null) {
      setEthValue((ethereumBalance / ethExchangeRate).toFixed(8)); // Calculate ETH value and format to 8 decimals
    }
  }, [ethExchangeRate, ethereumBalance]);

  //solana
  const [solExchangeRate, setSolExchangeRate] = useState(null); // To store SOL-USD rate
  const [solValue, setSolValue] = useState(null); // To store calculated SOL value

  useEffect(() => {
    // Fetch SOL to USD exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        setSolExchangeRate(data.solana.usd); // Set the SOL-USD rate
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  // Calculate the SOL value when solBalance or exchangeRate changes
  useEffect(() => {
    if (solExchangeRate !== null && solBalance !== null) {
      setSolValue((solBalance / solExchangeRate).toFixed(8)); // Calculate SOL value and format to 8 decimals
    }
  }, [solExchangeRate, solBalance]);


      //transactions//
      const [transactions, setTransactions] = useState([]);
    
      const fetchTransactions = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("User not logged in.");
          return;
        }
  
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
      };
  
  
      useEffect(() => {
        fetchTransactions();
      }); 
    


  return (
    <div className='layout'>
      <DesktopUserNav />

      <div className="dashboard-container content">

      <div className="container" >

      <div className="navigation-container">

      <NavLink to='/dashboard' className="mobile">
                <img src={logo} alt="keystonecapitals" />
                <p className='name'>Dashboard</p>
      </NavLink>


       <p className='desktop'>Welcome, {user.displayName}</p>

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

      <div className="accounts">

          <div className="accounts-container">

            <div className="account">

            <div className="name-logo">
                <img src={purse} alt="total" />
                <p>All <br className='br'/> Accounts</p>
            </div>

            <div className="available">
              <div className="total">
              <BsCurrencyDollar />{usdtBalance !== null || bitcoinBalance !== null || ethereumBalance !== null || solBalance !== null ? (
          <>
           {[
  usdtBalance || 0, 
  bitcoinBalance || 0, 
  ethereumBalance || 0, 
  solBalance || 0,
].reduce((acc, balance) => acc + balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

          </>
        ) : (
          "Loading..."
        )}
              </div>
              <p>Available balance</p>
            </div>

            </div>

            <NavLink to="/deposits" state={{ currentBalance: "USDT" }} className="account">

            <div className="name-logo">
                <img src={USDT} alt="total" />
                <p>USDT</p>
            </div>

            <div className="available">
              <div className="total">
              <BsCurrencyDollar />{usdtBalance !== null ? usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Loading..."}

              </div>
              <p>
              {usdtBalance !== null ? `${usdtBalance.toFixed(2)} USDT` : "Loading..."}
            </p>
              <p>Available balance</p>
            </div>

            </NavLink>

            <NavLink to='/deposits' className="account" state={{ currentBalance: "BTC" }}>

            <div className="name-logo">
                <img src={bitcoin} alt="total" />
                <p>BTC</p>
            </div>

            <div className="available">
              <div className="total">
              <BsCurrencyDollar />{bitcoinBalance !== null ? bitcoinBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Loading..."}

              </div>
              <p className='asset-value'>
            {btcValue !== null
              ? `${btcValue} BTC`
              : "Fetching wallet..."}
            </p>
              <p>Available balance</p>
            </div>

            </NavLink>

            <NavLink to="/deposits" state={{ currentBalance: "ETH" }} className="account">

            <div className="name-logo">
                <img src={Eth} alt="total" />
                <p>ETH</p>
            </div>

            <div className="available">
              <div className="total">
              <BsCurrencyDollar /> {ethereumBalance !== null ? ethereumBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Loading..."}

              </div>
                  <p>
            {ethValue !== null
              ? `${ethValue} ETH`
              : "Fetching wallet..."}
          </p>
              <p>Available balance</p>
            </div>

            </NavLink>

            <NavLink to="/deposits" state={{ currentBalance: "SOL" }} className="account">

            <div className="name-logo">
                <img src={sol} alt="total" />
                <p>SOL</p>
            </div>

            <div className="available">
              <div className="total">
              <BsCurrencyDollar /> {solBalance !== null ? solBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Loading..."}
              </div>
              <p>
              {solValue !== null ? `${solValue} SOL` : "Fetching wallet..."}
            </p>
              <p>Available balance</p>
            </div>

            </NavLink>

          </div>

      </div>

      <div className="act">

        <div className="actions-container">
          <h5>Quick Actions</h5>

          <div className="activities">

            <NavLink  to="/investments" className="activity desktop">
                <MdFormatListBulletedAdd  className='icon' />
              New Investment
            </NavLink>  
             <NavLink  to="/deposits" className="activity">
                <IoWalletOutline  className='icon' />
              Deposit
            </NavLink>
            <NavLink  to="/deposits" className="activity" state={{ currentPage: "convert" }}
            >
                <RiExchangeDollarLine  className='icon' />
              Convert
            </NavLink>
            <NavLink  to="/withdrawals" className="activity">
              <RiSendPlaneLine className='icon' />
             Withdraw
            </NavLink>

          </div>

            <NavLink to="/investments" className="activity mobile">
                <MdFormatListBulletedAdd  className='icon' />
              New Investment
            </NavLink>  


        </div>
        

      </div>

      <div className="newInvest-methods">

            <div className="newInvest-methods-container">

              <div className="active">
                <h5>Active Investments</h5>
                <div className="active-investments">
                  <p className='nothing'>
                  Your Active Investments will show here
                  </p>
                </div>
              </div>

              <div className="methods">
              <h5>Receive Deposits</h5>

              <div className="methods-content">
              
                <div className="methods-icons">

                  <div className="wallet">
                    <img src={bitcoin} alt="bitcoin" />

                    <div className="deposit-method">
                    <h4>Bitcoin</h4>
                    <p>Bitcoin (BTC)</p>
                    </div>

                  </div>

                  <div className="wallet">
                  <img src={Eth} alt="ethereum" />

                    <div className="deposit-method">
                    <h4>Ethereum</h4>
                    <p>Ethereum (ERC20)</p>
                    </div>

                  </div>

                  <div className="wallet">
                  <img src={USDT} alt="tether" />


                    <div className="deposit-method">
                    <h4>USDT</h4>
                    <p>Tether(ERC20)</p>
                    </div>

                  </div>

                  <div className="wallet">
                  <img src={sol} alt="solana" />


                    <div className="deposit-method">
                    <h4>Solana</h4>
                    <p>Solana Network (SOL)</p>
                    </div>

                  </div>

                  


              </div>

              </div>

             <NavLink to="/deposits" className='all-wallets'>View All Address <MdKeyboardArrowRight className='icon' /></NavLink>

          

              </div>

            </div>

      </div>

      <div className="investment-rates">
        <div className="investment-rates-container">
          <h5>Investment Rates</h5>

          <div className="rates">

           <div className="head rate">

                <div className="asset">Asset</div>
                <div className="capital">Minimum Capital</div>
                <div className="ROI">ROI</div>

           </div>

           <div className="roi-rate rate">

          <div className="asset"><img src={bitcoin} alt='bitcoin' /> BTC</div>
          <div className="capital">$50</div>
          <div className="ROI">+40%(2wks) / + 200%(2mnths)</div>

          </div>

          <div className="roi-rate rate">

          <div className="asset"><img src={Eth} alt='eth'/>ETH</div>
          <div className="capital">$50</div>
          <div className="ROI">+40%(2wks) / + 200%(2mnths)</div>

          </div>

          <div className="roi-rate rate">

          <div className="asset"><img src={USDT} alt='USDT'/> USDT</div>
          <div className="capital">$50</div>
          <div className="ROI">+40%(2wks) / + 200%(2mnths)</div>

          </div>

          <div className="roi-rate rate last">

          <div className="asset"><img src={sol} alt='solana' />SOL</div>
          <div className="capital">$50</div>
          <div className="ROI">+40%(2wks) / + 200%(2mnths)</div>

          </div>

          </div>

        </div>
      </div>

 <div className="recent-transactions">

                <div className="recent-transactions-container">
        <h4>Recent Transactions</h4>

        {transactions.length === 0 ? ( // Check if there are no transactions
          <div className='nothing-yet'>
            <BiTransfer className="icon" />
          <h4>No transactions yet</h4>  
          <p>Once you make a payment or convert funds, the information appears here</p>
            </div>
        ) : (
          <table>
            <tbody>
              {transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort transactions by date (newest first)
                .slice(0, 2) // Get only the first two transactions
                .map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>${Number(transaction.amount).toLocaleString()}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.transactionStatus}</td>
                    <td>{transaction.category}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        <div className="all-transactions">
          <NavLink to="/transactions">
            View All Transactions <IoIosArrowForward />
          </NavLink>
        </div>
      </div>


          </div>


      </div>

     



    </div>
  )
}

export default Dashboard