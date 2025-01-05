import React, { useState, useEffect } from "react";
import bitcoin from "../../src/stock/bitcoin-btc-logo.png"
import Eth from "../../src/stock/ethereum-eth-logo.png"
import USDT from "../../src/stock/tether-usdt-logo.png"
import sol from "../../src/stock/solana-sol-logo.png"
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "aos/dist/aos.css";
import AOS from "aos";
import "aos/dist/aos.js";

function Home() {
    const [selected, setSelected] = useState(null);

    const toggle = (i) => {
      if (selected === i) {
        return setSelected(null); // Close if clicked again
      }
      setSelected(i);
    };
  
    const faqData = [
      {
        question: "What is the minimum investment amount?",
        answer: "The minimum investment amount is $100. You can start small and grow your portfolio over time."
      },
      {
        question: "How long before I start seeing returns?",
        answer: "Investors typically start seeing returns within 30 days, depending on market conditions."
      },
      {
        question: "What cryptocurrencies do you trade?",
        answer: "We trade Bitcoin, Ethereum, USDT, Solana, and other popular cryptocurrencies."
      },
      {
        question: "How do I withdraw my profits?",
        answer: "You can withdraw profits anytime directly from your dashboard. We process withdrawals within 24 hours."
      }
    ];

    //
    const { hash } = useLocation();

    useEffect(() => {

      
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash.replace('#', ''));
          if (element) {
            const offset = element.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2) + (element.clientHeight / 2);
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }, 100); // Adjust delay as needed
      }
    }, [hash]);

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      document.title = "Keystone Capitals"

      if (!hasMounted) {
        setHasMounted(true);
        AOS.init({
          delay: 200,
        });
      } else {
        AOS.refresh();
      }
    }, [hasMounted]);
  
  return (
    <div className='page'>
        <div className="page-_container">

            <div className="landing">
                <div className="landing-content-container">
                 <h1   data-aos="zoom-in"
            data-aos-duration="500"
            data-aos-once="true">Empower Your Future with Smart Crypto Investments</h1>
                 <p   data-aos="zoom-in"
            data-aos-duration="800"
            data-aos-once="true">Maximize your crypto gains by trusting the professionals at Keystone Capitals to unlock your investment's full potential.</p>
                 <div className="buttons"   data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-once="true">
                     <NavLink >Learn More</NavLink>
                     <NavLink>Start Investing</NavLink>
                 </div>
                </div>
            </div>

            <div className="records">
                <div className="record-container">
                    <div className="record" 
                      // data-aos="zoom-in"
                    data-aos-duration="100"
                    data-aos-once="true">
                        <h3>10,000+</h3>
                        <p>Successful Investments</p>
                    </div>
                    <div className="record"
                      data-aos="zoom-in"
                      data-aos-duration="800"
                      data-aos-once="true">
                        <h3>$100,000+</h3>
                        <p>Total Investment</p>
                    </div>
                    <div className="record"
                      data-aos="zoom-in"
                      data-aos-duration="800"
                      data-aos-once="true">
                        <h3>3+</h3>
                        <p>Years of Experience</p>
                    </div>
                    <div className="record"
                      data-aos="zoom-in"
                      data-aos-duration="800"
                      data-aos-once="true">
                        <h3>24/7</h3>
                        <p>Customer Support</p>
                    </div>
                </div>
            </div>

            <section id="how" className="services service">
             
             <div className="service-container">

                <div className="right"
                data-aos="zoom-out-right"
                  data-aos-duration="800"
                  data-aos-once="true">

                </div>

                <div className="left">
                    <h4
                      data-aos="zoom-in"
                      data-aos-duration="800"
                      data-aos-once="true">How It Works</h4>
                    <h1
                      data-aos="zoom-in"
                      data-aos-duration="800"
                      data-aos-once="true">Invest in Cryptocurrencies. We Help Your Crypto Grow </h1>
                    <p
                      data-aos="zoom-in"
                      data-aos-duration="800"
                      data-aos-once="true">Our team of crypto trading experts manages your investments by taking your capital, actively trading in the cryptocurrency market, and returning both your initial capital and a percentage of the profits earned. We handle the complexities of crypto trading, allowing you to benefit from market opportunities without the hassle.</p>
                      <div  
                        data-aos="zoom-in"
                      data-aos-duration="500"
                      data-aos-once="true">
                    <NavLink to='/signup'
                   >Create Your Account</NavLink>
                      </div>
                </div>
             </div>
            </section>

            
            <section id="tradables" className="services assets">
             
             <div className="service-container">

                <div className="left">
                <h4
                data-aos="zoom-in"
                data-aos-duration="800"
                data-aos-once="true"
                >Tradable Assets</h4>
                    <h1
                    data-aos="zoom-in"
                    data-aos-duration="800"
                    data-aos-once="true"
                    >Start Investing in Minutes and Watch Your Portfolio Grow</h1>
                    <p
                    data-aos="zoom-in"
                    data-aos-duration="800"
                    data-aos-once="true"
                    >Investors have the opportunity to achieve up to 150% return on investment (ROI) with our diverse range of crypto assets. Leverage our platform to maximize your gains and explore new financial possibilities.</p>
                    <div
                    data-aos="zoom-in"
                    data-aos-duration="500"
                    data-aos-once="true"
                    > 
                    <NavLink to='/signup'>Get Started Today</NavLink>
                    </div>
                </div>


                <div className="right coins">
                    <div className="container">
                        <div className="box"
                       data-aos="zoom-in-right"
                        data-aos-once="true"
                        >
                            <img src={bitcoin} alt="bitcoin" />
                            <p>Bitcoin</p>
                        </div>
                        <div className="box"
                         data-aos="zoom-in-left"
                           data-aos-once="true"
                        >
                        <img src={USDT} alt="USDT" />
                            <p>USDT</p>
                        </div>
                        <div className="box"
                       data-aos="zoom-in-right"
                           data-aos-once="true"
                        >
                        <img src={sol} alt="sol" />
                            <p>Solana</p>
                        </div>
                        <div className="box"
                         data-aos="zoom-in-left"
                           data-aos-once="true"
                         >
                        <img src={Eth} alt="eth" />
                            <p>Ethereum</p>
                        </div>
                    </div>
                </div>

             </div>
            </section>

            <section id="faqs" className="faq-section">
      <h1 className="faq-title"
         data-aos="zoom-in"
         data-aos-duration="500"
         data-aos-once="true"
      >Frequently Asked Questions</h1>
      <div className="faq-container">
        {faqData.map((item, i) => (
          <div className="faq-item" key={i}>
            <div className="faq-question" onClick={() => toggle(i)}>
              <h3 className="faq-header"
               data-aos="zoom-in"
               data-aos-duration="500"
               data-aos-once="true"
              >{item.question}</h3>
              <span>{selected === i ? "-" : "+"}</span>
            </div>
            <div className={selected === i ? "faq-answer show" : "faq-answer"}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

        </div>

            <div className="startNow">
                <div className="the-background">

                    <div className="content-container"
                     data-aos="zoom-out"
                     data-aos-duration="500"
                     data-aos-once="true"
                    >
                        <div className="left">
                            <h2>Unlock the full potential of your crypto investments with Keystone Capitals.</h2>
                            <p>No risk, no hassle. Just a few clicks away.</p>
                        </div>
                        <div className="right">
                            <NavLink to='/signup'>Get started</NavLink>
                            <NavLink to='/login'>Sign in</NavLink>
                        </div>
                    </div>
                </div>
            </div>

    </div>
  )
}

export default Home