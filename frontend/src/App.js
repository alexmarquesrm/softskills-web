import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ListaUtilizadores from "./pages/listaUtilizadores";
import PerfilUtilizador from "./pages/perfilUtilizador"
import LandingPage from "./pages/paginaPrincipal";
import CustomNavbar from "./components/navbar/customNavbar";
import Footer from "./components/footer/footer";

function AppContent() {
    return (
        <div className="app-container">
            <div>
                <CustomNavbar />
            </div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/utilizadores/lista" element={<ListaUtilizadores />} />
                <Route path="/utilizadores/perfil" element={<PerfilUtilizador />} />

            </Routes>
            <div>
                <Footer />
            </div>
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
