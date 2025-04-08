import "../App.css";
import React from "react";
import CustomNavbar from "../components/navbar/customNavbar";
import FeaturedCourses from "../components/cards/cardCourses";
import PromoSection from "../components/promo/PromoSection";
import StatsSection from "../components/stats/StatsSection";
import Footer from "../components/footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function AppContent() {
 
  return (
    <div>
      <CustomNavbar />
      <FeaturedCourses />
      <PromoSection />
      <StatsSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    
      <AppContent />
   
  );
}

export default App;
