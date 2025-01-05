import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logo from "../stock/logo.png"

function Footer() {
    const location = useLocation();

  
    const hiddenPaths = [
       "/login", "/signup", "/verify-account", "/verify-account/username", "/dashboard", '/investments', '/transactions', '/deposits', '/withdrawals'
    ];
  
    const shouldHideComponent = hiddenPaths.includes(location.pathname);
    
  return (
    <div style={{ display: shouldHideComponent ? "none" : "block" }}>
    <div className='footer'>
        <div className="footer-container">

            <div className="links">
                <div className="logo">
                <NavLink to='/' className="logo-container">
                <img src={logo} alt="keystonecapitals" />
                <div className="name"><h3>KEYSTONE</h3><p>CAPITALS</p></div>
                </NavLink>
                </div>

                <div className="site-map">
                    <NavLink  to="/#tradables">Tradable Assets</NavLink>
                    <NavLink to="/#faqs">Deposits and Withdrawals</NavLink>
                    <NavLink>Help Center</NavLink>
                </div>

            </div>

            <div className="disclaimer">
                <p>
                Keystone Capitals Ltd is a digital asset management company registered in seychelles with registration number 8256612-1. The registered office of Keystone Capitals Ltd is at 9A CT House, 2nd floor, Providence, Mahe, Seychelles.
                </p>
                <p>
                Risk Warning: Trading and investing in cryptocurrencies and other digital assets involve a significant risk of loss and are not suitable for all investors. The value of cryptocurrencies can fluctuate widely, and you could lose a substantial portion or all of your investment. Leveraged trading can amplify both gains and losses. Before deciding to trade or invest, you should carefully consider your investment objectives, level of experience, and risk appetite.
                </p>
                <p>
                Keystone Capitals Ltd does not offer services to residents of certain jurisdictions, including the USA, Canada, Iran, North Korea, and others.
                </p>
                <p>
                The information on this website is provided for informational purposes only and does not constitute investment advice, a recommendation, or a solicitation to engage in any trading or investment activity. Any interaction with this website constitutes a voluntary operation by the user and should not be understood as an invitation to acquire Keystone Capitals' financial services or products.
                </p>
                <p>
                The content on this website may only be copied or reproduced with the express written permission of Keystone Capitals Ltd.
                </p>
                <p>
                Keystone Capitals Ltd complies with industry-standard security measures to protect your data and ensure the privacy of your transactions. We conduct regular security audits and vulnerability assessments to maintain the integrity of our systems.
                </p>
                <p>
                ¹At Keystone Capitals, the majority of withdrawals are processed within minutes. However, the processing time depends on your payment provider.
                </p>
                <p>
                ²Deposit fees may apply to specific payment methods as part of maintaining the security and efficiency of our services.
                </p>
                <p>
                ³Market conditions, including volatility and liquidity, can cause fluctuations in spreads and prices of digital assets.
                </p>
            </div>

            <div className="copyright">
            <p>&copy; 2021 Keystone Capitals. All rights reserved.</p>
           <p>Privacy Policy | Terms of Service</p>
            </div>

        </div>
    </div>
    </div>
  )
}

export default Footer