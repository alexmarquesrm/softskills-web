import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// Pages
import LandingPage from "./pages/landingPage";
import PagGestor from "./pages/gestor/pageGestor";
import ListaUtilizadores from "./pages/gestor/userList";
import PercursoFormativoGestor from "./pages/gestor/percursoFormativo";
import GestaoCursos from "./pages/gestor/courseManage";
import CursoDetalhesGestor from "./pages/gestor/pageCursoGestor";
import FormadorCurso from "./pages/formadores/detailsCourse";
import AvaliarFormando from "./pages/formadores/evaluateFormando";
import ManageCourses from "./pages/formadores/coursesManage";
import PerfilUtilizador from "./pages/formandos/userProfile";
import CursoFormando from "./pages/formandos/pageCourse";
import CursosFormando from "./pages/formandos/courses";
import PercursoFormativoFormando from "./pages/formandos/percursoFormativo";
import ListaPedidos from "./pages/gestor/pedidos";

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
                        <Route path="/utilizadores/curso/:id" element={<CursoFormando />} />
                        <Route path="/utilizadores/lista/cursos" element={<CursosFormando />} />
                        <Route path="/utilizadores/percursoFormativo" element={<PercursoFormativoFormando />} />
                        {/* Formador Routes */}
                        <Route path="/formador/cursos" element={<ManageCourses />} />
                        <Route path="/formador/curso/:id" element={<FormadorCurso />} />
                        <Route path="/formador/curso/avaliar" element={<AvaliarFormando />} />
                        {/* Gestor Routes */}
                        <Route path="/gestor/dashboard" element={<PagGestor />} />
                        <Route path="/gestor/lista/colaboradores" element={<ListaUtilizadores />} />
                        <Route path="/gestor/colaborador/percursoFormativo" element={<PercursoFormativoGestor />} />
                        <Route path="/gestor/lista/cursos" element={<GestaoCursos />} />
                        <Route path="/gestor/cursodetalhes/:id" element={<CursoDetalhesGestor />} />
                        <Route path="/gestor/lista/pedidos" element={<ListaPedidos />} />

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