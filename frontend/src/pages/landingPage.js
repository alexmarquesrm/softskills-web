import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import axios from "../config/configAxios";
/* COMPONENTES */
import FeaturedCourses from "../components/cards/cardCourses";
import CardRow from '../components/cards/cardRow';
import PromoSection from "../components/promo/promoSection";
import StatsSection from "../components/stats/statsSection";
import LandingCard from "../components/cards/cardLandingPage";
/* CSS */
import "./landingPage.css";

function AppContent() {
  const [cursosSincronos, setCursosSincronos] = useState([]);
  const [cursosAssincronos, setCursosAssincronos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Verificar se há uma mensagem de boas-vindas no estado de navegação
    if (location.state?.welcomeMessage) {
      toast.success(location.state.welcomeMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          marginTop: '60px' // Adiciona margem superior para descer a notificação
        }
      });
      // Limpar o estado após exibir a mensagem
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/curso/landing");

      // If the response is structured by type
      if (response.data.sincronos && response.data.assincronos) {
        setCursosSincronos(response.data.sincronos.slice(0, 3));
        setCursosAssincronos(response.data.assincronos.slice(0, 3));
      }
      // If the API still returns the old format (flat array)
      else if (Array.isArray(response.data)) {
        const sincronos = response.data
          .filter(curso => curso.tipo === "S")
          .slice(0, 3);

        const assincronos = response.data
          .filter(curso => curso.tipo === "A")
          .slice(0, 3);

        setCursosSincronos(sincronos);
        setCursosAssincronos(assincronos);
      }
    } catch (error) {
      console.error("Erro ao encontrar cursos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCourseCard = (curso, index) => (
    <FeaturedCourses key={curso.id || index} curso={curso} mostrarBotao={false} mostrarCertificado={true} />
  );

  return (
    <div className="app-content">

      <LandingCard />

      <Container className="my-5">
        <h2 className="section-title mb-4">Top Cursos Síncronos</h2>
        {cursosSincronos.length > 0 ? (
          <CardRow
            dados={cursosSincronos}
            renderCard={renderCourseCard}
            scrollable={false}
            colSize={4}
          />
        ) : (
          <p>Não existem cursos síncronos disponíveis no momento.</p>
        )}
      </Container>

      <Container className="my-5">
        <h2 className="section-title mb-4">Top Cursos Assíncronos</h2>
        {cursosAssincronos.length > 0 ? (
          <CardRow
            dados={cursosAssincronos}
            renderCard={renderCourseCard}
            scrollable={false}
            colSize={4}
          />
        ) : (
          <p>Não existem cursos assíncronos disponíveis no momento.</p>
        )}
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