import React, { useEffect, useState, } from "react";
import axios from "../config/configAxios";
import FeaturedCourses from "../components/cards/cardCourses";
import CardRow from '../components/cards/cardRow';
import PromoSection from "../components/promo/PromoSection";
import StatsSection from "../components/stats/StatsSection";
import { Container } from "react-bootstrap";

function AppContent() {
  const [cursos, setCursos] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/curso/landing", {
      });
      setCursos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCourseCard = (curso, index) => (
    <FeaturedCourses index={index} curso={curso} />
  );

  return (
    <div style={{marginLeft: "300px", marginRight: "300px"}}>    
      <Container className="my-4 px-500" style={{ maxWidth: '1650px' }}>
      <h2>Cursos Em Destaque</h2>
      <CardRow dados={cursos} renderCard={renderCourseCard} scrollable={false} colSize={4} />
      </Container>
      <PromoSection />
      <StatsSection />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
