import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ListaUtilizadores from "./pages/userList";
import PerfilUtilizador from "./pages/userProfile";
import LandingPage from "./pages/landingPage";
//import PagGestor from "./pages/pageGestor";
import CustomNavbar from "./components/navbar/customNavbar";
import Footer from "./components/footer/footer";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new component

function AppContent() {
    return (
        <div className="app-container">
            <CustomNavbar />
            <div className="content">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    
                    {/* Protected routes - Only accessible when logged in */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/utilizadores/lista" element={<ListaUtilizadores />} />
                        <Route path="/utilizadores/perfil" element={<PerfilUtilizador />} />
                        {/* <Route path="/landing/gestor" element={<PagGestor />} /> */}
                    </Route>
                    
                    {/* You can also add a catch-all route for 404 pages */}
                    <Route path="*" element={<Navigate to="/" />} />
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