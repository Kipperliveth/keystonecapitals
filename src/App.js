import "./Styles/Main.scss";
import { BrowserRouter as Router } from "react-router-dom"; 
import AnimatedRoutes from "./Pages/AnimatedRoutes";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";


function App() {
  return (
    <div>
      <Router>

    <Navbar />

    <AnimatedRoutes />

    <Footer />

    </Router>
    </div>
  );
}

export default App;
