import React, { useState, useEffect, useRef } from 'react';
import DesktopUserNav from '../App-Components/DesktopUserNav'
import { IoIosArrowDown } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";
import { Navigate, NavLink } from 'react-router-dom';
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
import { FaRegCopy } from "react-icons/fa6";
import axios from "axios";
import { doc, setDoc, collection, addDoc, serverTimestamp, increment, getDoc, updateDoc } from "firebase/firestore";
import { auth, txtdb } from "../../firebase-config"; // Adjust path as needed
import { useLocation } from "react-router-dom";
import {
  onAuthStateChanged,
} from "firebase/auth";
import { BsCurrencyDollar } from "react-icons/bs";
import { getDocs, query, orderBy } from "firebase/firestore";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlinePending } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { FaEyeSlash } from "react-icons/fa";


function Deposits() {

    const [user, setUser] = useState({})

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

    const [showLoader, setShowLoader] = useState(false)
    const [depositSuccess, setDepositSuccess] = useState(false)
    const [conversionSuccess, setConversionSuccess] = useState(false)

     // State to track if the sidebar is visible
     const [isSidebarVisible, setIsSidebarVisible] = useState(false);

     //conversion states

    const [receiptDetails, setReceiptDetails] = useState({
      amount: '',
      cryptoFrom: '',
      cryptoTo: '',
      date: new Date().toLocaleDateString(), // Automatically sets the current date
    });


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


   //current page\
   const location = useLocation();
  const [currentPage, setCurrentPage] = useState('');

    // Set the currentPage based on the passed state or default to 'add'
    useEffect(() => {
      if (location.state?.currentPage) {
        setCurrentPage(location.state.currentPage);
      } else {
        setCurrentPage("add"); // Default to 'add'
      }
    }, [location.state]);

  //current account balance
  const [currentBalance, setCurrentBalance] = useState('');
  
  //selector
  const [showSelector, setShowSelector] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    name: 'Ethereum', 
    image: Eth
  });

  const toggleSelector = () => {
    setShowSelector(prevShowSelector => !prevShowSelector);
  };

  const handleCoinSelect = (name, image) => {
    setSelectedCoin({ name, image });
    setShowSelector(true); // Close selector after choosing

      };

      useEffect(() => {
        if (location.state?.currentBalance) {
          setCurrentBalance(location.state.currentBalance);
          switch (location.state.currentBalance) {
            case "BTC":
              setSelectedCoin({ name: "Bitcoin", image: bitcoin });
              break;
            case "ETH":
              setSelectedCoin({ name: "Ethereum", image: Eth });
              break;
            case "SOL":
              setSelectedCoin({ name: "Solana", image: sol });
              break;
            case "USDT":
              setSelectedCoin({ name: "Tether (USDT)", image: USDT });
              break;
            default:
              setSelectedCoin({ name: "Ethereum", image: Eth }); // Default coin
          }
        } else {
          setCurrentBalance("ETH"); // Default to 'add'
        }
      }, [location.state]);

  //converter
  const userId = auth.currentUser?.uid;
  const [amount, setAmount] = useState(0); // Amount in USD
  const [cryptoFrom, setCryptoFrom] = useState("Ethereum");
  const [cryptoTo, setCryptoTo] = useState("Bitcoin");
  const [cryptoOptions] = useState(["Ethereum", "Bitcoin", "Solana", "USDT"]);
  const [balances, setBalances] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user balances
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balancePromises = cryptoOptions.map(async (crypto) => {
          const docRef = doc(txtdb, `users/${userId}/balances/${crypto}`);
          const docSnap = await getDoc(docRef);
          return { [crypto]: docSnap.exists() ? docSnap.data().balance : 0 };
        });

        const balanceResults = await Promise.all(balancePromises);
        const mergedBalances = balanceResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setBalances(mergedBalances);
      } catch (error) {
        setErrorMessage("Failed to fetch balances.");
      }
    };

    fetchBalances();
  }, [userId, cryptoOptions]);

  // Handle amount change
  const handleAmountChange = (e) => {
    setAmount(parseFloat(e.target.value) || 0);
  };

  // Handle asset selection for 'cryptoFrom'
  const handleCryptoFromChange = (e) => {
    const selectedCrypto = e.target.value;
    setCryptoFrom(selectedCrypto);

    // Automatically adjust `cryptoTo` if it's the same as `cryptoFrom`
    if (cryptoTo === selectedCrypto) {
      setCryptoTo(cryptoOptions.find((crypto) => crypto !== selectedCrypto));
    }
  };

  // Handle conversion
  const handleConversion = async () => {
    if (amount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      setSuccessMessage(""); // Clear success message
      return;
    }
  
    if (amount > (balances[cryptoFrom] || 0)) {
      setErrorMessage("You cannot transfer more than your available balance.");
      setSuccessMessage(""); // Clear success message
      return;
    }
  
    if (cryptoFrom === cryptoTo) {
      setErrorMessage("You cannot transfer to the same asset.");
      setSuccessMessage(""); // Clear success message
      return;
    }
  
    setErrorMessage("");
  
    const fromNewBalance = (balances[cryptoFrom] || 0) - amount;
    const toNewBalance = (balances[cryptoTo] || 0) + amount;
  
    try {
      setShowLoader(true);
      // Update Firebase balances
      const fromRef = doc(txtdb, `users/${userId}/balances/${cryptoFrom}`);
      const toRef = doc(txtdb, `users/${userId}/balances/${cryptoTo}`);
  
      await updateDoc(fromRef, { balance: fromNewBalance });
      await updateDoc(toRef, { balance: toNewBalance });
  
      // Update local state
      setBalances((prev) => ({
        ...prev,
        [cryptoFrom]: fromNewBalance,
        [cryptoTo]: toNewBalance,
      }));
  
      setAmount(0); // Reset the amount field
  
      // Create a transaction history document
      const transactionData = {
        date: new Date().toISOString(), // ISO format date
        amount,
        description: `${cryptoFrom} to ${cryptoTo}`,
        transactionStatus: "Successful",
        category: "Conversion",
      };
  
      // Set receipt details using `balances` for consistency
      setReceiptDetails({
        amount: amount,
        cryptoFrom: cryptoFrom,
        cryptoTo: cryptoTo,
        balanceBefore: balances[cryptoFrom] ? balances[cryptoFrom].toFixed(2) : 'Loading...',
        date: new Date().toLocaleDateString(), // Capture the current date
      });
  
      const transactionsRef = collection(txtdb, `users/${userId}/transactions`);
      await addDoc(transactionsRef, transactionData);
  
      // Display success message
      setSuccessMessage(`Successfully transferred $${amount.toFixed(2)} from ${cryptoFrom} to ${cryptoTo}.`);
      setShowLoader(false);
      setConversionSuccess(true);
  
    } catch (error) {
      setErrorMessage("Failed to process transfer.");
      setSuccessMessage(""); // Clear success message
      setShowLoader(false);
    }
  };
  

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
document.title= "Deposit"
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
  
    const [transferredAmount, setTransferredAmount] = useState(0); // New state to store amount

    const [copiedMessage, setCopiedMessage] = useState('');

 const handleCopy = (text, asset) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      setCopiedMessage(`${asset} address copied to clipboard`);
      setTimeout(() => {
        setCopiedMessage('');
      }, 3000); // hides after 3 seconds
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
};

    const [showBalance, setShowBalance] = useState(true);

    const toggleBalance = () => setShowBalance(prev => !prev);

    const [error, setError] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (Number(amount) < 500) {
        setError("The minimum balance is 500 dollars.");
        return;
      }
      setError("");
      // continue with your submit logic here
      console.log("Submitted:", amount);
    }
     
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

                    <NavLink to="/withdrawals" className="settings top">
                        <RiSendPlaneLine className='icon' /> Send Money
                    </NavLink>

                    <NavLink to="/investments" className="settings">
                        <MdFormatListBulletedAdd  className='icon' /> New Investment
                    </NavLink>

                    <NavLink to="deposits" state={{ currentPage: "convert" }} className="settings">
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

        <div className="deposits">

        <div className="add-convert">

          <div className="add-convert-container">

                <div className={currentPage === 'add' ? 'action' : 'action'} onClick={() => setCurrentPage('add')}><IoIosAdd className='tabicon' /> Add Funds</div>

                <div className={currentPage === 'convert' ? 'action' : 'action'} onClick={() => setCurrentPage('convert')}><RiExchangeDollarLine className='tabicon' />Convert Funds</div>
                <NavLink to='/withdrawals' className="action"><RiSendPlaneLine className='tabicon' />Send Money</NavLink>

          </div>

      {currentPage === 'add' && (
        <div className='add-funds'>

          <div className="funding-container">

            <div className="wallet tab">

              <div className="switch-balance">

              <div className="switch">

            <div className="switch-container" onClick={toggleSelector}>

              <div className='asset' >
              <img src={selectedCoin.image} alt="asset" />
              <p className="asset-name">{selectedCoin.name}</p>
              </div>

              <div className="switch-button">
                Switch <span> <MdKeyboardArrowUp /> <MdKeyboardArrowDown /> </span>
              </div>

              {showSelector && (
        <div className="asset-selector">
          <div className="coin" onClick={() => {
            handleCoinSelect('Bitcoin', bitcoin);
            setCurrentBalance('BTC'); // setCurrentPage to 'fourth' when Bitcoin is selected
             }}>
            <img src={bitcoin} alt="bitcoin" />
            <p className="coin-name">Bitcoin</p>
          </div>

          <div className="coin"   onClick={() => {
            handleCoinSelect('Ethereum', Eth);
            setCurrentBalance('ETH'); // setCurrentPage to 'fourth' when Ethereum is selected
          }}>
            <img src={Eth} alt="ethereum" />
            <p className="coin-name">Ethereum</p>
          </div>
          
          <div className="coin" onClick={() => {handleCoinSelect('USDT', USDT); setCurrentBalance("USDT")}}>
            <img src={USDT} alt="usdt" />
            <p className="coin-name">USDT</p>
          </div>

          <div className="coin" onClick={() => {handleCoinSelect('Solana', sol); setCurrentBalance("SOL")}}>
            <img src={sol} alt="solana" />
            <p className="coin-name">Solana</p>
          </div>

        </div>
              )}

            </div>

              </div>

              <div className="balance">

              {currentBalance === 'BTC' && (
            <div className='asset-balance'>
              <div className="total">
                <BsCurrencyDollar />
                {showBalance
                  ? (bitcoinBalance !== null
                    ? bitcoinBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : "Loading...")
                  : "****"}
              </div>
              <p className='asset-value'>
                {showBalance
                  ? (btcValue !== null ? `${btcValue} BTC` : "Fetching wallet...")
                  : "****"}
              </p>
            </div>
          )}


          {currentBalance === 'ETH' && (
            <div className='asset-balance'>
              <div className="total">
                <BsCurrencyDollar />
                {showBalance
                  ? (ethereumBalance !== null
                      ? ethereumBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "Loading...")
                  : "****"}
              </div>
              <p>
                {showBalance
                  ? (ethValue !== null ? `${ethValue} ETH` : "Fetching wallet...")
                  : "****"}
              </p>
            </div>
          )}

          {currentBalance === 'USDT' && (
            <div className='asset-balance'>
              <div className="total">
                <BsCurrencyDollar />
                {showBalance
                  ? (usdtBalance !== null
                      ? usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "Loading...")
                  : "****"}
              </div>
              <p>
                {showBalance
                  ? (usdtBalance !== null
                      ? `${usdtBalance.toFixed(2)} USDT`
                      : "Loading...")
                  : "****"}
              </p>
            </div>
          )}

          {currentBalance === 'SOL' && (
            <div className='asset-balance'>
              <div className="total">
                <BsCurrencyDollar />
                {showBalance
                  ? (solBalance !== null
                      ? solBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "Loading...")
                  : "****"}
              </div>
              <p>
                {showBalance
                  ? (solValue !== null ? `${solValue} SOL` : "Fetching wallet...")
                  : "****"}
              </p>
            </div>
          )}


      <p onClick={toggleBalance} style={{ cursor: 'pointer' }}>
        Wallet balance {showBalance ? <FaEye /> : <FaEyeSlash />}
      </p>


              </div>

              </div>

              <NavLink to='/investments'>Invest Now <MdKeyboardArrowRight /> </NavLink>

            </div>

            <div className="details tab">

              <h4>Receiving Address</h4>

              {currentBalance === 'BTC' && (
                     <div className='aza'>

                     <p className='address-header'> Bitcoin Address</p>
                     <p className='address' onClick={() => handleCopy('bc1qzyyushrkdl76h2wsg5csppuk3kxl02dfa336em', "Bitcoin")}>
                     bc1qzyyushrkdl76h2wsg5csppuk3kxl02dfa336em <span><FaRegCopy className='copy' /></span>
                  </p>
   
                     <p>BTC <p className='network'>Network</p></p>
   
                   </div>
                  )}

                    {currentBalance === 'ETH' && (
                <div className='aza'>

                  <p className='address-header'> Ethereum Address</p>
                  <p className='address' onClick={() => handleCopy('0x654E638F8309Fa96E635E9BE315126D102132553', 'Ethereum')}>
                  0xE756c2e16D6a2a802eB36Db60a0E9D5F5CbC5c8b <span><FaRegCopy className='copy' /></span>
                  </p>


                  <p>ERC20 <p className='network'>Network</p></p>

                </div>
                  )}

              {currentBalance === 'USDT' && (
                     <div className='aza'>

                     <p className='address-header'> USDT Address</p>
                     <p className='address' onClick={() => handleCopy('0xE756c2e16D6a2a802eB36Db60a0E9D5F5CbC5c8b', "USDT")}>
                     0xE756c2e16D6a2a802eB36Db60a0E9D5F5CbC5c8b <span><FaRegCopy className='copy' /></span>
                  </p>
   
                     <p>ERC20/Tether USDT <p className='network'>Network</p></p>
   
                   </div>
                  )}

              {currentBalance === 'SOL' && (
                    <div className='aza'>

                    <p className='address-header'> Solana Address</p>
                    <p className='address' onClick={() => handleCopy('EdzTjThyXaPPG92KCBkarPnCdz2f1QaaVAUqwZAwZ75q', "Solana" )}>
                    EdzTjThyXaPPG92KCBkarPnCdz2f1QaaVAUqwZAwZ75q <span><FaRegCopy className='copy' /></span>
                  </p>
  
                    <p>SOL <p className='network'>Network</p></p>
  
                  </div>
                  )}


            </div>

            <div className="declaration tab">
            <h4>Transfer Details</h4>
            
            <div className="asset-info">
              <img src={selectedCoin.image} alt={selectedCoin.name} className="asset-logo" />
              <p className="asset-name">{selectedCoin.name}</p>
            </div>

            <form
      className="transfer-form"
      onSubmit={async (e) => {
        e.preventDefault();

    // Get the input values
    const amountTransferred = parseFloat(e.target.amount.value);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be logged in to confirm transfer.");
      return;
    }

    const userId = currentUser.uid; // Get user ID
    const selectedAsset = selectedCoin.name; // e.g., "BTC", "ETH", "USDT"

    // References
    const depositsRef = collection(txtdb, "users", userId, "deposits");
    // const assetBalanceRef = doc(txtdb, "users", userId, "balances", selectedAsset);
    const transactionsRef = collection(txtdb, "users", userId, "transactions");
    const transactionData = {
      date: new Date().toISOString(), // ISO format date
      amount: amountTransferred,
      description: `Deposited ${selectedAsset}`,
      transactionStatus: "Pending",
      category: "Deposit",
    };

    try {
      setShowLoader(true);
      // Save the deposit in the "deposits" sub-collection
      await addDoc(depositsRef, {
        amount: amountTransferred,
        asset: selectedAsset,
        time: serverTimestamp(),
      });

      // Update the user's balance for the asset
      // await setDoc(
      //   assetBalanceRef,
      //   { balance: increment(amountTransferred) }, // Create or update the balance
      //   { merge: true } // Merge with existing data
      // );

      // Add a transaction to the "transactions" collection
      // await addDoc(transactionsRef, transactionData);
      const transactionRef = await addDoc(transactionsRef, transactionData);
      const transactionId = transactionRef.id;



        //Add deposit request
            
                    const depositRef = collection(txtdb, `pendingDeposits`);
                    const depositData = {
                      date: new Date().toISOString(),
                      amount: amountTransferred,
                      transactionStatus: "Pending",
                      userId,
                      username: user.displayName,
                      asset: selectedAsset,
                      transactionId,
                    };
      
      
                    await addDoc(depositRef, depositData);
      
      
      // Success alert
      // alert(`Deposit confirmed! ${amountTransferred} ${selectedAsset} added to your balance.`);
      setTransferredAmount(amountTransferred); 
      setShowLoader(false);
      setDepositSuccess(true)
      e.target.reset(); // Reset the form after submission
    } catch (error) {
      console.error("Error processing deposit:", error);
      alert("There was an error confirming your deposit.");
    }
  }}
>
    <label htmlFor="amount">Amount</label>
    <input
      type="number"
      id="amount"
      name="amount"
      placeholder="Enter amount you transferred"
      min="500"
      required
    />


  <button type="submit" className="submit-btn">
    Confirm Transfer
  </button>
</form>

{error && <p style={{ color: "red" }}>{error}</p>}

          </div>

          </div>
            

          <div className="recent-transactions">

                <div className="recent-transactions-container">
        <h4>Recent Transactions</h4>

        {transactions.length === 0 ? ( // Check if there are no transactions
          <div className='nothing-yet'>
            <BiTransfer className="icon" />
          <h4>No transactions yet</h4>  
          <p>Once you make a payment or convert funds, <br /> the information appears here</p>
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

        <div  className="all-transactions">
          <NavLink to="/transactions">
            View All Transactions <IoIosArrowForward />
          </NavLink>
        </div>
      </div>


          </div>



        </div>
    )}

      {currentPage === 'convert' && (
          <div className='convert-funds'> 
            
            <div className="conversion-container">
            <div className="crypto-converter">
      <div className="converter-section">
        <label>Amount to Transfer (in USD) *</label>
        <div className="input-group">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            min="0"
          />
          <select value={cryptoFrom} onChange={handleCryptoFromChange}>
            {cryptoOptions.map((crypto) => (
              <option key={crypto} value={crypto}>
                {crypto}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="converter-section">
        <label>Transfer To *</label>
        <div className="input-group">
          <select value={cryptoTo} onChange={(e) => setCryptoTo(e.target.value)}>
            {cryptoOptions
              .filter((crypto) => crypto !== cryptoFrom) // Remove selected `cryptoFrom` from `cryptoTo` options
              .map((crypto) => (
                <option key={crypto} value={crypto}>
                  {crypto}
                </option>
              ))}
          </select>
        </div>
      </div>

      <button className="convert-btn" onClick={handleConversion}>
        Transfer Assets
      </button>
      <br />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {/* {successMessage && <p className="success-message">{successMessage}</p>} */}

    </div>
  

            </div>

          </div>
      )}


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

      {depositSuccess && (
        <div className="deposit-receipt">

          <div className="receipt">

           <div className='icon-con'>
              <MdOutlinePending className='icon' />
           </div>

          <h2 className='amount'>${transferredAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCoin.name}</h2>

          <h4>Deposit Is Being Vetted</h4>

          <p>This transaction is being processed. Your account will be updated shortly.</p>

            <NavLink to='/transactions'>
              <CiViewList /> View Transaction
            </NavLink>

        <button onClick={() => setDepositSuccess(false)} className='close'>Close</button>

          </div>
        </div>
      )
      }

      {conversionSuccess && (
        <div className="conversion-receipt">
          <div className="reciept-details">
            <div className='icon-con'>
              <BiTransfer className='icon' />
            </div>

            <h2>${receiptDetails.amount}.00</h2>
            <p>Conversion Successful</p>
            <span className='line'></span>

            <h6>Conversion Details:</h6>
            <div className="conversion-details">
              <ol>
                <span>Asset Used:</span>
                <span>{receiptDetails.cryptoFrom}</span>
              </ol>

              <ol>
                <span>Balance Before:</span>
                <span>${receiptDetails.balanceBefore}</span> {/* Replace with a dynamic balance if needed */}
              </ol>

              <div className='trans'><BiTransfer /></div>

              <ol>
                <span>Amount Converted:</span>
                <span>${receiptDetails.amount}.00</span>
              </ol>

              <ol>
                <span>Asset:</span>
                <span>{receiptDetails.cryptoTo}</span>
              </ol>

              <ol>
                <span>Date:</span>
                <span>  {new Date(receiptDetails.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}{" "}
                </span>
              </ol>
            </div>

            <button onClick={() => setConversionSuccess(false)} className='close'>
              Close
            </button>
          </div>
        </div>
      )}

{copiedMessage && (
  <div className="copy-popup">
    {copiedMessage}
  </div>
)}




    </div>
  )
}

export default Deposits