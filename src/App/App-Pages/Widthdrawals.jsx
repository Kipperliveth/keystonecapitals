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
import { PiHandWithdraw } from "react-icons/pi";
import { RiSendPlaneLine } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";
import { MdFormatListBulletedAdd } from "react-icons/md";
import bitcoin from "../../stock/bitcoin-btc-logo.png"
import Eth from "../../stock/ethereum-eth-logo.png"
import USDT from "../../stock/tether-usdt-logo.png"
import sol from "../../stock/solana-sol-logo.png"
import { doc, setDoc, collection, addDoc, serverTimestamp, increment, getDoc, updateDoc } from "firebase/firestore";
import { auth, txtdb } from "../../firebase-config"; // Adjust path as needed
import {
  onAuthStateChanged,
} from "firebase/auth";

function Widthdrawals() {
      const [user, setUser] = useState({})
          const [showLoader, setShowLoader] = useState(false)
        const [withdrwalSuccess, setWithdrwalSuccess] = useState(false)
  
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

   //

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
   document.title= "Withdrawals"
   fetchEthereumBalance();
   fetchBitcoinBalance();
   fetchUsdtBalance();
   fetchSolBalance();
   })
   
   
   //fetching value
   
   //btc
   const [bitcoinExchangeRate, setBitcoinExchangeRate] = useState(null); // To store BTC-USD rate
   const [btcValue, setBtcValue] = useState(null); // To store calculated BTC value
   
   useEffect(() => {
   // Fetch BTC to USD exchange rate
   const fetchExchangeRate = async () => {
     try {
       const response = await fetch(
         "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
       );
       const data = await response.json();
       setBitcoinExchangeRate(data.bitcoin.usd); // Set the BTC-USD rate
     } catch (error) {
       console.error("Error fetching exchange rate:", error);
     }
   };
   
   fetchExchangeRate();
   }, []);
   
   // Calculate the BTC value when bitcoinBalance or exchangeRate changes
   useEffect(() => {
   if (bitcoinExchangeRate !== null && bitcoinBalance !== null) {
     setBtcValue((bitcoinBalance / bitcoinExchangeRate).toFixed(8)); // Calculate BTC value and format to 8 decimals
   }
   }, [bitcoinExchangeRate, bitcoinBalance]);
   
   
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
   
   //

   const [selectedAsset, setSelectedAsset] = useState(null);
   const [cryptoType, setCryptoType] = useState("");
const [withdrawAmount, setWithdrawAmount] = useState("");
const [walletAddress, setWalletAddress] = useState("");
const [message, setMessage] = useState("");  // Feedback message for user

const handleSelectAsset = (asset) => {
  setSelectedAsset(asset);
  setMessage("");  // Clear previous messages
};

const handleAmountChange = (e) => setWithdrawAmount(e.target.value);
const handleWalletAddressChange = (e) => setWalletAddress(e.target.value);

const handleWithdraw = async () => {
  
  if (!selectedAsset || !withdrawAmount || !walletAddress || !cryptoType) {
    setMessage("Please fill in all fields and select an asset.");
    return;
  }

  const amount = parseFloat(withdrawAmount);
  if (isNaN(amount) || amount <= 0) {
    setMessage("Enter a valid withdrawal amount.");
    return;
  }

  let balance = 0;
  switch (selectedAsset) {
    case "Bitcoin": balance = bitcoinBalance; break;
    case "Ethereum": balance = ethereumBalance; break;
    case "USDT": balance = usdtBalance; break;
    case "Solana": balance = solBalance; break;
    default: setMessage("Invalid asset."); return;
  }

  if (amount > balance) {
    setMessage("Insufficient balance for this withdrawal.");
    return;
  }

  try {
    setShowLoader(true);
    const userId = currentUser.uid; // Ensure user is logged in

    const balanceRef = doc(txtdb, "users", currentUser.uid, "balances", selectedAsset);
    await updateDoc(balanceRef, { balance: balance - amount });

    // setMessage(`Withdrawal of ${amount} ${selectedAsset} successful.`);

       // Add transaction history using setDoc
              const transactionsRef = collection(txtdb, `users/${userId}/transactions`);
              const transactionData = {
                date: new Date().toISOString(),
                amount: withdrawAmount,
                description: `Withdrew ${withdrawAmount} from ${selectedAsset}`,
                transactionStatus: "Pending",
                category: "Withdrawal",
              };

      //Add withdrwal request
      
              const withdrwalRef = collection(txtdb, `transactions`);
              const withdrwaData = {
                date: new Date().toISOString(),
                amount: withdrawAmount,
                description: `Withdrew ${withdrawAmount} to ${walletAddress}`,
                transactionStatus: "Pending",
                category: "Withdrawal",
                userId
              };


              await addDoc(withdrwalRef, withdrwaData);
              await addDoc(transactionsRef, transactionData);
              setShowLoader(false); 
              setWithdrwalSuccess(true);
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    setMessage("Withdrawal failed. Try again later.");
    setShowLoader(false); 
  }
};

   
 
  return (
    <div className='layout'>
    <DesktopUserNav />

    <div className="content">

    <div className="withdrawals-container container" >

    <div className="navigation-container">

    <NavLink to='/dashboard' className="mobile">
              <img src={logo} alt="keystonecapitals" />
              <p className='name'>Withdrawals</p>
    </NavLink>


     <p className='desktop'>Withdrawals</p>

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

    <div className="withdrawals">

      <div className="withdrawals-container">

        <div className="balance">
          <h2>${usdtBalance !== null || bitcoinBalance !== null || ethereumBalance !== null || solBalance !== null ? (
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
        )}</h2>
          <p>Your Combined Balance</p>
        </div>

        <div className="withdrawals-list">
          <h4>Your Assets</h4>
          <p>You can pick only one</p>

          <div className="assets">

          <button className={`asset ${selectedAsset === "Bitcoin" ? "selected" : ""}`} onClick={() => handleSelectAsset("Bitcoin")}>  
  <img src={bitcoin} alt="" />
  <div className="bal">
    <span>
      <h2>BTC</h2>
      <p>Bitcoin</p>
    </span>
    <span>
      <h2>${bitcoinBalance !== null ? bitcoinBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Loading..."}</h2>
      <p>{btcValue !== null ? `${btcValue} BTC` : "Fetching wallet..."}</p>
    </span>
  </div>
          </button>

          <button className={`asset ${selectedAsset === "USDT" ? "selected" : ""}`} onClick={() => handleSelectAsset("USDT")}> 
            <img src={USDT} alt="" />
            <div className="bal">
              <span>
                <h2>USDT</h2>
                <p>Tedther USDT</p>
              </span>
              <span>
                <h2>${usdtBalance !== null ? usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Loading..."}</h2>
                <p>{usdtBalance !== null ? `${usdtBalance.toFixed(2)} USDT` : "Loading..."}</p>
              </span>
            </div>
          </button>

          <button className={`asset ${selectedAsset === "Ethereum" ? "selected" : ""}`} onClick={() => handleSelectAsset("Ethereum")}> 
            <img src={Eth} alt="" />
            <div className="bal">
              <span>
                <h2>ETH</h2>
                <p>Ethereum</p>
              </span>
              <span>
                <h2>$ {ethereumBalance !== null ? ethereumBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Loading..."}</h2>
                <p>{ethValue !== null ? `${ethValue} ETH` : "Fetching wallet..."}</p>
              </span>
            </div>
          </button>

          <button className={`asset ${selectedAsset === "Solana" ? "selected" : ""}`} onClick={() => handleSelectAsset("Solana")}> 
            <img src={sol} alt="" />
            <div className="bal">
              <span>
                <h2>SOL</h2>
                <p>Solana</p>
              </span>
              <span>
                <h2>${solBalance !== null ? solBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Loading..."}</h2>
                <p>{solValue !== null ? `${solValue} SOL` : "Fetching wallet..."}</p>
              </span>
            </div>
          </button>


          </div>


        </div>

        <div className="withdrawals-form">

        <span>
        <label htmlFor="amountInput">Amount</label> 
        <input type="number" id="amountInput" placeholder='Enter amount'onChange={handleAmountChange} value={withdrawAmount} required/>
        </span>


        <span>
        <label htmlFor="cryptoType">Withdrawal wallet type</label>
        <select required id="cryptoType"  onChange={(e) => setCryptoType(e.target.value)}
          value={cryptoType}>
          <option value="" disabled selected>
            Select wallet Type
          </option>
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="SOL">Solana (SOL)</option>
          <option value="USDT">Tether (USDT)</option>
      </select>
        </span>

      <span>
      <label htmlFor="walletAddress">Wallet Address</label>
      <input type="input" id="walletAddress" placeholder='Wallet Address' onChange={handleWalletAddressChange} value={walletAddress} required/>
      </span>

        </div>

          <button onClick={handleWithdraw} className='withdraw-btn'>Withdraw</button>

          {message && <p className='error'>{message}</p>}
          
      </div>
      
    </div>

    </div>

    </div>

    
    {showLoader && (
        <div className="loader">
          <div className="spinner">
            <div></div>   
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
            <div></div>    
          </div>


        </div>
      )}

      {withdrwalSuccess && (
          <div className="deposit-receipt">
        
                  <div className="receipt">
        
                   <div className='icon-con'>
                      <PiHandWithdraw className='icon' />
                   </div>
        
                  <h2 className='amount'>${withdrawAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedAsset}</h2>
        
                  <h4>Withdrawal Request has been submitted</h4>
        
                  <p>This transaction is being processed. Your account will be updated shortly.</p>
        
                    <NavLink to='/transactions'>
                      <CiViewList /> View Transaction
                    </NavLink>
        
                <button onClick={() => setWithdrwalSuccess(false)} className='close'>Close</button>
        
                  </div>
                </div>
      )

      }

  </div>
  )
}

export default Widthdrawals