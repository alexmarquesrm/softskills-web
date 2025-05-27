import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Pages
import LandingPage from "./pages/landingPage";
import PerfilUtilizador from "./pages/formandos/userProfile";
import CursoFormando from "./pages/formandos/pageCourse";
import CursosFormando from "./pages/formandos/listCourses";
import PercursoFormativoFormando from "./pages/formandos/percursoFormativo";
import PagFormando from "./pages/formandos/pageFormando";

import FormadorCurso from "./pages/formadores/detailsCourse";
import AvaliarFormando from "./pages/formadores/evaluateFormando";
import ManageCourses from "./pages/formadores/coursesManage";
import PagFormador from "./pages/formadores/pageFormador";

import PagGestor from "./pages/gestor/pageGestor";
import ListaUtilizadores from "./pages/gestor/userList";
import CursoDetalhesGestor from "./pages/gestor/pageCursoGestor";
import ListaPedidos from "./pages/gestor/pedidos";
import AdicionarCurso from "./pages/gestor/addCourse";
import PercursoFormativoGestor from "./pages/gestor/percursoFormativo";
import GestaoCursos from "./pages/gestor/courseManage";
import EditarCurso from "./pages/gestor/editCourse";
import ViewPedido from "./pages/gestor/viewPedido";
import PedirCurso from "./pages/formadores/pedirCurso";
import CategoriesList from "./pages/gestor/categoriesList";
import AreasList from "./pages/gestor/areasList";
import TopicsList from "./pages/gestor/topicsList";
import AboutUs from "./pages/microsite";


// Forum Pages
import ForumList from "./pages/forum/forumList";
import ForumDetail from "./pages/forum/forumDetail";
import CreateThread from "./pages/forum/createThread";
import ThreadDetail from "./pages/forum/threadDetail";

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
                        <Route path="/utilizadores/dashboard" element={<PagFormando />} />
                        
                        {/* Formador Routes - Protected by role */}
                        <Route path="/formador/*" element={<ProtectedRoute />}>
                            <Route path="cursos" element={<ManageCourses />} />
                            <Route path="curso/:id" element={<FormadorCurso />} />
                            <Route path="curso/avaliar" element={<AvaliarFormando />} />
                            <Route path="dashboard" element={<PagFormador />} />
                            <Route path="pedircurso" element={<PedirCurso />} />
                        </Route>
                        
                        {/* Gestor Routes - Protected by role */}
                        <Route path="/gestor/*" element={<ProtectedRoute />}>
                            <Route path="dashboard" element={<PagGestor />} />
                            <Route path="lista/colaboradores" element={<ListaUtilizadores />} />
                            <Route path="colaborador/percursoFormativo" element={<PercursoFormativoGestor />} />
                            <Route path="lista/cursos" element={<GestaoCursos />} />
                            <Route path="cursodetalhes/:id" element={<CursoDetalhesGestor />} />
                            <Route path="lista/pedidos" element={<ListaPedidos />} />
                            <Route path="cursos/add" element={<AdicionarCurso />} />
                            <Route path="cursos/edit/:id" element={<EditarCurso />} />
                            <Route path="pedidos/view/:id" element={<ViewPedido />} />
                            <Route path="lista/categorias" element={<CategoriesList />} />
                            <Route path="lista/areas" element={<AreasList />} />
                            <Route path="lista/topicos" element={<TopicsList />} />
                        </Route>

                        {/* Forum Routes */}
                        <Route path="/forum" element={<ForumList />} />
                        <Route path="/forum/:id" element={<ForumDetail />} />
                        <Route path="/forum/:id/create-thread" element={<CreateThread />} />
                        <Route path="/forum/:id/thread/:threadId" element={<ThreadDetail />} />
                    </Route>
                    
                    {/* Public Routes */}
                    <Route path="*" element={<Navigate to="/" />} />

                    {/* Micro Site */}
                    <Route path="/microsite" element={<AboutUs />} />

                </Routes>
            </div>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
                theme="light"
                style={{ marginTop: '60px', zIndex: 1000 }}
            />
            <AppContent />
        </Router>
    );
}

export default App;