import { React, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./Home";
import How from "./How"
import AboutUs from "./AboutUs";
import Contact from "./Contact";
import Currencies from "./Currencies";
import Dashboard from "../App/App-Pages/Dashboard";
import Login from "../App/Auth/Login";
import ProtectedRoute from "../App/Auth/AuthGuard";
import Signup from "../App/Auth/Signup";
import OTP from "../App/Auth/OTP";
import Onboarding from "../App/Auth/Username";
import Deposits from "../App/App-Pages/Deposits";
import Widthdrawals from "../App/App-Pages/Widthdrawals";
import Transactions from "../App/App-Pages/Transactions";
import Investments from "../App/App-Pages/Investments";
import PendingDeposits from "../App/App-Pages/PendingDeposits";

function AnimatedRoutes() {

    const location = useLocation();

    useEffect(() => {
      // Scroll to the top when the route changes
      window.scrollTo(0, 0);
    }, [location.pathname]);



  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/currencies" element={<Currencies />} />
      <Route path="/how-it-works" element={<How />} />

      {/* app */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-account" element={<OTP />} />
      <Route path="/verify-account/username" element={<Onboarding />} />

      <Route path="/dashboard" element={<Dashboard /> } />
      <Route path="/deposits" element={<Deposits /> } />
       <Route path="/withdrawals" element={<Widthdrawals /> } />
      <Route path="/transactions" element={<Transactions /> } />
       <Route path="/investments" element={<Investments /> } />

      <Route path="/pendingDeposits" element={<PendingDeposits />} />

        </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes