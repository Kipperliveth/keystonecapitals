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
import purse from '../../stock/purse.png'
import { RiPlayListAddLine } from "react-icons/ri";
import { MdHistory } from "react-icons/md";
import { doc, getDoc } from 'firebase/firestore';
import { auth, txtdb } from '../../firebase-config';

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

   //tab
  const [currentPage, setCurrentPage] = useState('first');

  //pop up form
  const [showPopup, setShowPopup] = useState(false);

  // const togglePopup = () => {
  //   setShowPopup(!showPopup);
  // };

  //duration and shit
  const [investmentName, setInvestmentName] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [totalBalance, setTotalBalance] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [calculatedReturn, setCalculatedReturn] = useState('');

  // Asset balances in USD
  const [ethereumBalance, setEthereumBalance] = useState(null);
  const [bitcoinBalance, setBitcoinBalance] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(null);
  const [solBalance, setSolBalance] = useState(null);

  // Interest rates for durations
  const interestRates = {
    '2 weeks': 0.4,
    '1 month': 0.7,
    '1 month, 2 weeks': 1.1,
    '2 months': 2.0,
  };

  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  // Fetch balances for each asset
const fetchBalances = async () => {
  if (currentUser) {
    const userId = currentUser.uid;
    try {
      const ethBalanceRef = doc(txtdb, "users", userId, "balances", "Ethereum");
      const btcBalanceRef = doc(txtdb, "users", userId, "balances", "Bitcoin");
      const usdtBalanceRef = doc(txtdb, "users", userId, "balances", "USDT");
      const solBalanceRef = doc(txtdb, "users", userId, "balances", "Solana");

      const ethDocSnap = await getDoc(ethBalanceRef);
      const btcDocSnap = await getDoc(btcBalanceRef);
      const usdtDocSnap = await getDoc(usdtBalanceRef);
      const solDocSnap = await getDoc(solBalanceRef);

      setEthereumBalance(ethDocSnap.exists() ? ethDocSnap.data().balance || 0 : 0);
      setBitcoinBalance(btcDocSnap.exists() ? btcDocSnap.data().balance || 0 : 0);
      setUsdtBalance(usdtDocSnap.exists() ? usdtDocSnap.data().balance || 0 : 0);
      setSolBalance(solDocSnap.exists() ? solDocSnap.data().balance || 0 : 0);

      setLoading(false); // Set loading to false when data is fetched

    } catch (error) {
      console.error("Error fetching balances:", error);
      setLoading(false); // Set loading to false if there is an error
    }
  }
};

  useEffect(() => {
    fetchBalances();
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setSelectedAsset('');
    setInvestmentAmount('');
    setTotalBalance(null);
    setSelectedDuration('');
    setCalculatedReturn('');
  };

  const handleAssetChange = (event) => {
    const asset = event.target.value;
    setSelectedAsset(asset);

    if (asset === 'BTC') {
      setTotalBalance(bitcoinBalance);
    } else if (asset === 'ETH') {
      setTotalBalance(ethereumBalance);
    } else if (asset === 'USDT') {
      setTotalBalance(usdtBalance);
    } else if (asset === 'SOL') {
      setTotalBalance(solBalance);
    } else {
      setTotalBalance(null);
    }

    setInvestmentAmount('');
    setCalculatedReturn('');
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;

    if (totalBalance !== null && value > totalBalance) {
      alert('Investment amount cannot exceed your total balance.');
      return;
    }

    setInvestmentAmount(value);

    if (selectedDuration) {
      const returnAmount = value * (1 + interestRates[selectedDuration]);
      setCalculatedReturn(returnAmount.toFixed(2));
    }
  };

  const handleDurationChange = (event) => {
    const duration = event.target.value;
    setSelectedDuration(duration);

    if (investmentAmount) {
      const returnAmount = investmentAmount * (1 + interestRates[duration]);
      setCalculatedReturn(returnAmount.toFixed(2));
    }
  };

   //balances\
  
//eth balance

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



useEffect(() =>{
document.title= "Deposit"
fetchEthereumBalance();
fetchBitcoinBalance();
fetchUsdtBalance();
fetchSolBalance();
})
  

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

        <div className="investments">

        <div className="account-summary-container">
          
          <div className="account-balance">

            <img src={purse} alt="wallet" />

            <div className="balance">
                <h6>My Balance</h6>

                <h1>$ 132.0</h1>

                <h6 className='portfolio'>Total Portfolio Value: +$12</h6>
            </div>

          </div>

        <div className="new-investment" onClick={togglePopup}>

           <div ><RiPlayListAddLine className='icon'/></div>  <h3>New Investment</h3>


        </div>

        </div>

        <div className="tabs">
        <button className={currentPage === 'first' ? 'active' : ''} onClick={() => setCurrentPage('first')}>Active Investments</button>

        <button className={currentPage === 'second' ? 'active' : ''} onClick={() => setCurrentPage('second')}>Completed Investments</button>

        <NavLink to="/transactions" className='history'><MdHistory className='icon' /> History</NavLink>
        </div>

        <div className="active-investments">

      {currentPage === 'first' && (
        <div className="first">
          <h3>Active Investments</h3>
        </div>
      )}


    {currentPage === 'second' && (
        <div className="second">
          <h3>complete Investments</h3>
        </div>
      )}

        </div>

        </div>

    </div>

    </div>


    {showPopup && (
        <div className="overlay">
          <div className="popup">
            <button onClick={togglePopup} className="close-button">
              ×
            </button>
            <h3>New Investment</h3>
            <form >
              <div className="form-group">
                <label>Investment Name:</label>
                <input
                  type="text"
                  placeholder="Enter investment name"
                  value={investmentName}
                  onChange={(e) => setInvestmentName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Choose Asset:</label>
                <select value={selectedAsset} onChange={handleAssetChange}>
                  <option value="">Select an asset</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="SOL">Solana (SOL)</option>
                </select>
              </div>

              {totalBalance !== null && (
                <div className="form-group">
                  <label>Total Balance (USD):</label>
                  <input
                    type="text"
                    value={`$${totalBalance}`}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              )}

              {selectedAsset && (
                <div className="form-group">
                  <label>Investment Amount:</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={investmentAmount}
                    onChange={handleAmountChange}
                    max={totalBalance || ''}
                  />
                </div>
              )}

              {investmentAmount && (
                <div className="form-group">
                  <label>Choose Duration:</label>
                  <select value={selectedDuration} onChange={handleDurationChange}>
                    <option value="">Select a duration</option>
                    <option value="2 weeks">2 Weeks (40% Interest)</option>
                    <option value="1 month">1 Month (70% Interest)</option>
                    <option value="1 month, 2 weeks">1 Month, 2 Weeks (110% Interest)</option>
                    <option value="2 months">2 Months (200% Interest)</option>
                  </select>
                </div>
              )}

              {calculatedReturn && (
                <div className="form-group">
                  <label>Estimated Return (USD):</label>
                  <input
                    type="text"
                    value={`$${calculatedReturn}`}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              )}

              <button type="submit" disabled={!selectedDuration || !investmentAmount || !investmentName}>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

  </div>
  )
}

export default Investments