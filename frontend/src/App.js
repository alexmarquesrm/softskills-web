import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ListaUtilizadores from "./pages/listaUtilizadores";
import LandingPage from "./pages/paginaPrincipal";

function AppContent() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/" && location.pathname !== "/about-us";

  return (
      <div className="app-container">
          {showSidebar && (
              <div className="sidebar-container">
              
              </div>
          )}
              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/utilizadores/lista" element={<ListaUtilizadores/>} />
              </Routes>
          </div>
     
  );
}

function App() {
  return (
      <Router>
          <AppContent />
      </Router>
  );
}

export default App;
