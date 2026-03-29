import {Route, Routes } from "react-router-dom";
import Home from "./features/components/Home/Home";
import Navbar from "./features/components/Navbar/Navbar";
import Footer from "./features/components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import SocialIcons from "./features/components/SocialIcons/SocialIcons";
import AuctionDetails from "./features/components/AuctionDetails/AuctionDetails";
import About from "./features/components/About/About";
import TermsConditions from "./features/components/Terms-Conditions/TermsConditions";
import PageTop from "./features/components/PageTop/PageTop";
import CreateAd from "./features/components/CreateAd/CreateAd";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false
    });
  }, []);
  return (
    <>
      <Navbar/>
      <PageTop/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/create-ad" element={<CreateAd />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/auction-details/:id" element={<AuctionDetails />} />
      </Routes>
      <SocialIcons/>
      <Footer/>
    </>
  );
}

export default App;