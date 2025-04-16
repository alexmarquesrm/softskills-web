import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Pages
import LandingPage from "./pages/landingPage";
import PagGestor from "./pages/gestor/pageGestor";
import ListaUtilizadores from "./pages/gestor/userList";
import PerfilUtilizador from "./pages/formandos/userProfile";
import EditarUtilizadorGestor from "./modals/gestor/editUser";
import PercursoFormativoGestor from "./pages/gestor/percursoFormativo";
import GestaoCursos from "./pages/gestor/courseManage";
import FormadorCurso from "./pages/formador/pageCourseFormador";
import AvaliarFormando from "./pages/formador/evaluateFormando";

// Modals
import AdicionarFicheiroAssincronoFormador from "./modals/addFile";

// Components
import CustomNavbar from "./components/navbar/customNavbar";
import Footer from "./components/footer/footer";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
    return (
        <div className="app-container">
            <CustomNavbar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route element={<ProtectedRoute />}>
                        {/* Formandos Routes */}
                        <Route path="/utilizadores/perfil" element={<PerfilUtilizador />} />
                        {/* Formador Routes */}
                        <Route path="/formador/adicionarAssincrono" element={<AdicionarFicheiroAssincronoFormador />} />
                        <Route path="/formador/curso" element={<FormadorCurso />} />
                        <Route path="/formador/avaliar" element={<AvaliarFormando />} />

                        {/* Gestor Routes */}
                        <Route path="/gestor/dashboard" element={<PagGestor />} />
                        <Route path="/gestor/editarPerfil" element={<EditarUtilizadorGestor />} />
                        <Route path="/gestor/lista/colaboradores" element={<ListaUtilizadores />} />
                        <Route path="/gestor/colaborador/percursoFormativo" element={<PercursoFormativoGestor />} />
                        <Route path="/gestor/gestaoCurso" element={<GestaoCursos />} />
                    </Route>
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