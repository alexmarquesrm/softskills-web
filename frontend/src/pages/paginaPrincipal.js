import axios from "axios";
import React, { useEffect, useState } from "react";
import FeaturedCourses from "../components/cards/cardCourses";
import PromoSection from "../components/promo/PromoSection";
import StatsSection from "../components/stats/StatsSection";
import "bootstrap/dist/css/bootstrap.min.css";

function AppContent() {
  const [cursos, setCursos] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/sincrono");
      setCursos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <FeaturedCourses cursos={cursos} />
      <PromoSection />
      <StatsSection />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
