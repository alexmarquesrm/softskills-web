import React, { useState, useEffect, useRef } from "react";
import axios from "../../config/configAxios"; 
import { Gear, Flag, EnvelopeOpen, PersonCircle, BoxArrowRight, Book, PeopleFill, Building, Grid, ChevronRight, ChevronDown } from "react-bootstrap-icons";
import "./sidebar.css";
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const tipoUtilizador = sessionStorage.getItem("tipo") || null;
  const [activeItem, setActiveItem] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para controlar visibilidade do menu de categorias
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  
  // Estado para controlar categorias expandidas e áreas expandidas
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedAreas, setExpandedAreas] = useState({});
  
  const sidebarRef = useRef(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/categoria");
        setCategorias(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao obter categorias:", err);
        setError("Falha ao carregar categorias");
      } finally {
        setLoading(false);
      }
    };

    // Fetch categories regardless of user type
    fetchCategorias();
  }, []);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fechar o menu de categorias quando a sidebar for fechada
  useEffect(() => {
    if (!isOpen) {
      setShowCategoriesMenu(false);
      setExpandedCategories({});
      setExpandedAreas({});
    }
  }, [isOpen]);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  // Funções para navegação programática
  const navigateToCategory = (categoryId, e) => {
    e.preventDefault();
    navigate(`/categorias/${categoryId}`);
    onClose();
  };
  
  const navigateToArea = (areaId, e) => {
    e.preventDefault();
    navigate(`/areas/${areaId}`);
    onClose();
  };
  
  const navigateToTopic = (topicId, e) => {
    e.preventDefault();
    navigate(`/topicos/${topicId}`);
    onClose();
  };

  // Toggle para menu de categorias
  const toggleCategoriesMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCategoriesMenu(prev => !prev);
    
    // Reiniciar estados expandidos quando fechar o menu
    if (showCategoriesMenu) {
      setExpandedCategories({});
      setExpandedAreas({});
    }
  };

  // Toggle para expandir/colapsar uma categoria
  const toggleCategory = (categoryId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Altera apenas o estado da categoria clicada
    setExpandedCategories(prev => {
      const newState = { ...prev };
      newState[categoryId] = !prev[categoryId];
      return newState;
    });
    
    // Fecha todas as áreas quando colapsar uma categoria
    if (expandedCategories[categoryId]) {
      const updatedAreas = { ...expandedAreas };
      // Encontrar a categoria atual
      const categoria = categorias.find(cat => cat.categoria_id === categoryId);
      if (categoria && categoria.categoria_areas) {
        // Remover todas as áreas desta categoria do estado de expansão
        categoria.categoria_areas.forEach(area => {
          delete updatedAreas[area.area_id];
        });
        setExpandedAreas(updatedAreas);
      }
    }
  };

  // Toggle tópicos para uma área específica
  const toggleAreaTopics = (areaId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setExpandedAreas(prev => ({
      ...prev,
      [areaId]: !prev[areaId]
    }));
  };

  const NavItem = ({ href, icon, label, itemName, hasChildren, onClick, isExpanded, onToggle }) => (
    <a 
      href={onClick ? undefined : href} 
      className={`sidebar-item ${activeItem === itemName ? 'active' : ''} ${hasChildren ? 'has-children' : ''}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
        handleItemClick(itemName);
      }}
    >
      <div className="sidebar-icon">{icon}</div>
      <span className="sidebar-label">{label}</span>
      {hasChildren && (
        <div className="toggle-icon" onClick={onToggle || onClick}>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      )}
    </a>
  );

  // Renderizar menu de categorias com categorias fechadas por padrão 
  const renderCategoriesMenu = () => {
    if (loading) {
      return <div className="sidebar-loading">A carregar categorias...</div>;
    }

    if (error) {
      return <div className="sidebar-error">{error}</div>;
    }

    return (
      <div className="categories-menu">
        {categorias.map((categoria) => (
          <div key={categoria.categoria_id} className="categoria-section">
            <div className="categoria-header">
              <div className={`categoria-title-container ${expandedCategories[categoria.categoria_id] ? 'expanded' : ''}`}>
                <a 
                  href={`/categorias/${categoria.categoria_id}`}
                  className="categoria-title"
                  onClick={(e) => navigateToCategory(categoria.categoria_id, e)}
                >
                  {categoria.descricao}
                </a>
                {categoria.categoria_areas && categoria.categoria_areas.length > 0 && (
                  <div 
                    className="toggle-icon" 
                    onClick={(e) => toggleCategory(categoria.categoria_id, e)}
                  >
                    {expandedCategories[categoria.categoria_id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </div>
                )}
              </div>
            </div>
            
            {/* Áreas visíveis apenas quando a categoria está expandida */}
            {expandedCategories[categoria.categoria_id] && categoria.categoria_areas && categoria.categoria_areas.length > 0 && (
              <div className="areas-container">
                {categoria.categoria_areas.map((area) => (
                  <div key={area.area_id} className="area-item">
                    <div className="area-header">
                      <a 
                        href={`/areas/${area.area_id}`}
                        className="area-title"
                        onClick={(e) => {
                          if (!(area.area_topicos && area.area_topicos.length > 0 && e.target === e.currentTarget)) {
                            navigateToArea(area.area_id, e);
                          }
                        }}
                      >
                        {area.descricao}
                      </a>
                      {area.area_topicos && area.area_topicos.length > 0 && (
                        <div 
                          className="toggle-icon" 
                          onClick={(e) => toggleAreaTopics(area.area_id, e)}
                        >
                          {expandedAreas[area.area_id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </div>
                      )}
                    </div>
                    
                    {/* Tópicos colapsáveis */}
                    {expandedAreas[area.area_id] && area.area_topicos && area.area_topicos.length > 0 && (
                      <div className="topics-container">
                        {area.area_topicos.map((topico) => (
                          <a 
                            key={topico.topico_id}
                            href={`/topicos/${topico.topico_id}`}
                            className="topic-item"
                            onClick={(e) => navigateToTopic(topico.topico_id, e)}
                          >
                            {topico.descricao}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className={`custom-sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
        <div className="sidebar-brand">
          <h3>
            <span className="brand-text-dark">Soft</span>
            <span className="brand-text-accent">Skills</span>
          </h3>
        </div>

        <div className="sidebar-menu">
          {/* Menu Principais para todos os tipos de usuário */}
          <div className="menu-section">
            <span className="menu-heading">PRINCIPAIS</span>
            
            {/* Botão Categorias apenas para não-gestores */}
            {tipoUtilizador !== "Gestor" && (
              <>
                <NavItem 
                  href="#" 
                  icon={<Book size={16} />} 
                  label="Categorias" 
                  itemName="categorias-menu" 
                  hasChildren={true}
                  isExpanded={showCategoriesMenu}
                  onToggle={toggleCategoriesMenu}
                  onClick={toggleCategoriesMenu}
                />
                
                {/* Menu de categorias expandido */}
                {showCategoriesMenu && (
                  <div className="sidebar-submenu">
                    {renderCategoriesMenu()}
                  </div>
                )}
              </>
            )}
            
            {/* Itens específicos para cada tipo de usuário */}
            {tipoUtilizador === "Gestor" && (
              <>
                <NavItem href="/gestor/lista/cursos" icon={<Book size={16} />} label="Gerir Cursos" itemName="cursos" />
                <NavItem href="/gestor/lista/colaboradores" icon={<PeopleFill size={16} />} label="Gerir Colaboradores" itemName="colaboradores" />
                <NavItem href="/gestor/lista/departamentos" icon={<Building size={16} />} label="Gerir Departamentos" itemName="departamentos" />
                <NavItem href="/gestor/lista/funcoes" icon={<Gear size={16} />} label="Gerir Funções" itemName="funcoes" />
                <NavItem href="/gestor/lista/denuncias" icon={<Flag size={18} />} label="Ver Denúncias" itemName="denuncias" />
                <NavItem href="/gestor/lista/pedidos" icon={<EnvelopeOpen size={18} />} label="Ver Pedidos" itemName="pedidos" />
              </>
            )}

            {tipoUtilizador === "Formando" && (
              <>
                <NavItem href="/utilizadores/percursoFormativo" icon={<Flag size={18} />} label="Percurso Formativo" itemName="percurso" />
                <NavItem href="/" icon={<EnvelopeOpen size={18} />} label="Fórum" itemName="forum" />
              </>
            )}

            {tipoUtilizador === "Formador" && (
              <>
                <NavItem href="/formador/cursos" icon={<Flag size={18} />} label="Cursos a lecionar" itemName="form_cursos" />
              </>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          {tipoUtilizador ? (
            <div className="menu-section">
              <span className="menu-heading">CONTA</span>
              <NavItem href="/utilizadores/perfil" icon={<PersonCircle size={18} />} label="Perfil" itemName="perfil" />
              <NavItem href="/logout" icon={<BoxArrowRight size={18} />} label="Logout" itemName="logout" />
            </div>
          ) : (
            <div className="menu-section">
              <span className="menu-heading">CONTA</span>
              <NavItem href="/login" icon={<PersonCircle size={18} />} label="Entrar" itemName="login" />
              <NavItem href="/registar" icon={<PeopleFill size={18} />} label="Registar" itemName="registar" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;