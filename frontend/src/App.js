import "./App.css";
import React from "react";
import CustomNavbar from "./components/navbar/customNavbar";
import FeaturedCourses from "./components/courses/FeaturedCourses";
import PromoSection from "./components/promo/PromoSection";
import StatsSection from "./components/stats/StatsSection";
import Footer from "./components/footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
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

export default App;
