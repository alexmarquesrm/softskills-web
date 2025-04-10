import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ListaUtilizadores from "./pages/userList";
import PerfilUtilizador from "./pages/userProfile";
import EditarUtilizadorGestor from "./pages/editarUtilizador_Gestor";
import AdicionarUtilizadorGestor from "./pages/adicionarUtilizador_Gestor";

import LandingPage from "./pages/landingPage";
//import PagGestor from "./pages/pageGestor";
import CustomNavbar from "./components/navbar/customNavbar";
import Footer from "./components/footer/footer";

function AppContent() {
    return (
        <div className="app-container">
            <CustomNavbar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/utilizadores/lista" element={<ListaUtilizadores />} />
                    <Route path="/utilizadores/perfil" element={<PerfilUtilizador />} />
                    <Route path="/gestor/editarPerfil" element={<EditarUtilizadorGestor />} />
                    <Route path="/gestor/adicionarPerfil" element={<AdicionarUtilizadorGestor />} />

                    {/* <Route path="/landing/gestor" element={<PagGestor />} /> */}
                </Routes>
            </div>
            <Footer />
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
