import React, { useState, useEffect, useRef } from "react";
import axios from "../../config/configAxios"; 
import { Gear, Flag, EnvelopeOpen, PersonCircle, BoxArrowRight, Book, PeopleFill, Building, Grid, ChevronRight } from "react-bootstrap-icons";
import "./sidebar.css";
import { useNavigate } from 'react-router-dom'; // Importando para navegação programática

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Hook para navegação
  // Get user type from session storage if available
  const tipoUtilizador = sessionStorage.getItem("tipo") || null;
  const [activeItem, setActiveItem] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para os menus hover
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeArea, setActiveArea] = useState(null);
  
  // Adicionar delay para evitar fechamento imediato dos menus
  const [mouseIsOverCategory, setMouseIsOverCategory] = useState(false);
  const [mouseIsOverArea, setMouseIsOverArea] = useState(false);
  
  // Refs para os menus e elementos
  const sidebarRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const areaMenuRef = useRef(null);
  const activeCategoryItemRef = useRef(null);
  const activeAreaItemRef = useRef(null);

  // Estado para armazenar as posições dos menus
  const [categoryMenuPosition, setCategoryMenuPosition] = useState({ top: 0, left: 0 });
  const [areaMenuPosition, setAreaMenuPosition] = useState({ top: 0, left: 0 });

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

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fechar menus quando clicar fora da sidebar e dos menus flutuantes
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        (!categoryMenuRef.current || !categoryMenuRef.current.contains(event.target)) &&
        (!areaMenuRef.current || !areaMenuRef.current.contains(event.target))
      ) {
        setActiveCategory(null);
        setActiveArea(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fechar menus quando a sidebar for fechada
  useEffect(() => {
    if (!isOpen) {
      setActiveCategory(null);
      setActiveArea(null);
    }
  }, [isOpen]);

  // Efeito para controlar o fechamento dos menus com delay
  useEffect(() => {
    let timeoutId;
    
    if (!mouseIsOverCategory && !mouseIsOverArea) {
      // Adicionar um pequeno delay antes de fechar os menus
      timeoutId = setTimeout(() => {
        if (!mouseIsOverCategory && !mouseIsOverArea) {
          setActiveCategory(null);
          setActiveArea(null);
        }
      }, 200); // 200ms delay para evitar fechamento acidental
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [mouseIsOverCategory, mouseIsOverArea]);

  // Atualizar posição do menu de categorias quando ativa
  useEffect(() => {
    if (activeCategory && activeCategoryItemRef.current) {
      const itemRect = activeCategoryItemRef.current.getBoundingClientRect();
      
      // Largura da sidebar baseada em CSS variables
      const sidebarWidth = window.innerWidth <= 768 ? 280 : 330;
      
      setCategoryMenuPosition({
        top: itemRect.top,
        left: sidebarWidth, // Posiciona diretamente após a sidebar
      });
    }
  }, [activeCategory]);

  // Atualizar posição do menu de áreas quando ativa
  useEffect(() => {
    if (activeArea && activeAreaItemRef.current && categoryMenuRef.current) {
      const itemRect = activeAreaItemRef.current.getBoundingClientRect();
      const categoryMenuRect = categoryMenuRef.current.getBoundingClientRect();
      
      // Adicionar um gap menor entre os menus
      const gap = 0; // Pode ser 0 ou um valor pequeno
      
      setAreaMenuPosition({
        top: itemRect.top,
        left: categoryMenuRect.right + gap, // Posiciona logo após o menu de categorias
      });
    }
  }, [activeArea]);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  // Funções para navegação programática
  const navigateToCategory = (categoryId, e) => {
    e.preventDefault();
    navigate(`/categorias/${categoryId}`);
    onClose(); // Fechar a sidebar após navegar
  };
  
  const navigateToArea = (areaId, e) => {
    e.preventDefault();
    navigate(`/areas/${areaId}`);
    onClose(); // Fechar a sidebar após navegar
  };
  
  const navigateToTopic = (topicId, e) => {
    e.preventDefault();
    navigate(`/topicos/${topicId}`);
    onClose(); // Fechar a sidebar após navegar
  };

  const NavItem = ({ href, icon, label, itemName, hasChildren, onClick }) => (
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
      {hasChildren && <ChevronRight className="chevron-icon" size={14} />}
    </a>
  );

  // Manipuladores para hover com referência aos elementos
  const handleCategoryHover = (categoriaId, event) => {
    setActiveCategory(categoriaId);
    setActiveArea(null); // Resetar área ao mudar de categoria
    activeCategoryItemRef.current = event.currentTarget;
    setMouseIsOverCategory(true);
  };

  const handleCategoryLeave = () => {
    setMouseIsOverCategory(false);
  };

  const handleAreaHover = (areaId, event) => {
    setActiveArea(areaId);
    activeAreaItemRef.current = event.currentTarget;
    setMouseIsOverArea(true);
  };

  const handleAreaLeave = () => {
    setMouseIsOverArea(false);
  };

  // Render categories
  const renderCategories = () => {
    if (loading) {
      return <div className="sidebar-loading">A carregar categorias...</div>;
    }

    if (error) {
      return <div className="sidebar-error">{error}</div>;
    }

    return categorias.map((categoria) => (
      <div 
        key={categoria.categoria_id} 
        className="sidebar-category-item"
        onMouseEnter={(e) => handleCategoryHover(categoria.categoria_id, e)}
        onMouseLeave={handleCategoryLeave}
      >
        <NavItem 
          href={`/categorias/${categoria.categoria_id}`}
          icon={<Book size={16} />}
          label={categoria.descricao}
          itemName={`categoria-${categoria.categoria_id}`}
          hasChildren={categoria.categoria_areas && categoria.categoria_areas.length > 0}
          onClick={(e) => navigateToCategory(categoria.categoria_id, e)}
        />
      </div>
    ));
  };

  // Encontrar a categoria ativa
  const getActiveCategory = () => {
    if (!activeCategory) return null;
    return categorias.find(cat => cat.categoria_id === activeCategory);
  };

  // Encontrar a área ativa
  const getActiveArea = () => {
    const category = getActiveCategory();
    if (!category || !activeArea) return null;
    
    const areas = category.categoria_areas || [];
    return areas.find(area => area.area_id === activeArea);
  };

  // Renderizar menu de categorias (primeiro nível)
  const renderCategoryMenu = () => {
    const activeCategoria = getActiveCategory();
    if (!activeCategoria || !activeCategoria.categoria_areas) return null;

    return (
      <div 
        ref={categoryMenuRef}
        className="dropdown-menu category-menu"
        style={{
          ...categoryMenuPosition,
          // Adicionar um elemento invisível que estende até o menu de tópicos
          ...(activeArea && {
            paddingRight: '30px' // Espaço extra para criar uma "ponte" invisível
          })
        }}
        onMouseEnter={() => setMouseIsOverCategory(true)}
        onMouseLeave={handleCategoryLeave}
      >
        <div className="menu-header">
          <h4>{activeCategoria.descricao}</h4>
        </div>
        <div className="menu-content">
          {activeCategoria.categoria_areas.map((area) => (
            <div 
              key={area.area_id} 
              className="menu-item"
              onMouseEnter={(e) => handleAreaHover(area.area_id, e)}
            >
              <a 
                href={`/areas/${area.area_id}`}
                className="menu-link"
                onClick={(e) => navigateToArea(area.area_id, e)}
              >
                {area.descricao}
                {area.area_topicos && area.area_topicos.length > 0 && (
                  <ChevronRight className="menu-chevron" size={12} />
                )}
              </a>
            </div>
          ))}
        </div>
        
        {/* Ponte invisível para o menu de tópicos */}
        {activeArea && (
          <div 
            className="menu-bridge"
            style={{
              position: 'absolute',
              top: activeAreaItemRef.current ? 
                (activeAreaItemRef.current.getBoundingClientRect().top - categoryMenuPosition.top) : 0,
              right: '-30px',
              width: '30px',
              height: '40px',
              background: 'transparent',
              zIndex: 1550
            }}
          />
        )}
      </div>
    );
  };

  // Renderizar menu de tópicos (segundo nível)
  const renderTopicsMenu = () => {
    const activeArea = getActiveArea();
    if (!activeArea || !activeArea.area_topicos || activeArea.area_topicos.length === 0) {
      return null;
    }

    return (
      <div 
        ref={areaMenuRef}
        className="dropdown-menu topics-menu"
        style={areaMenuPosition}
        onMouseEnter={() => setMouseIsOverArea(true)}
        onMouseLeave={handleAreaLeave}
      >
        <div className="menu-header">
          <h4>{activeArea.descricao}</h4>
        </div>
        <div className="menu-content">
          {activeArea.area_topicos.map((topico) => (
            <div key={topico.topico_id} className="menu-item">
              <a 
                href={`/topicos/${topico.topico_id}`}
                className="menu-link"
                onClick={(e) => navigateToTopic(topico.topico_id, e)}
              >
                {topico.descricao}
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      {/* Menus flutuantes renderizados como componentes separados */}
      {isOpen && activeCategory && renderCategoryMenu()}
      {isOpen && activeCategory && activeArea && renderTopicsMenu()}

      <div className={`custom-sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
        <div className="sidebar-brand">
          <h3>
            <span className="brand-text-dark">Soft</span>
            <span className="brand-text-accent">Skills</span>
          </h3>
        </div>

        <div className="sidebar-menu">
          {/* Common section for all users (including not logged in) */}
          <div className="menu-section">
            <span className="menu-heading">CATEGORIAS</span>
            <div className="sidebar-categories">
              {renderCategories()}
            </div>
          </div>
          
          {/* Conditional sections based on user type */}
          {tipoUtilizador === "Gestor" && (
            <>
              <div className="menu-section">
                <span className="menu-heading">PRINCIPAIS</span>
                <NavItem href="/gestor/lista/cursos" icon={<Book size={16} />} label="Gerir Cursos" itemName="cursos" />
                <NavItem href="/gestor/lista/colaboradores" icon={<PeopleFill size={16} />} label="Gerir Colaboradores" itemName="colaboradores" />
                <NavItem href="/gestor/lista/departamentos" icon={<Building size={16} />} label="Gerir Departamentos" itemName="departamentos" />
                <NavItem href="/gestor/lista/funcoes" icon={<Gear size={16} />} label="Gerir Funções" itemName="funcoes" />
                <NavItem href="/gestor/lista/denuncias" icon={<Flag size={18} />} label="Ver Denúncias" itemName="denuncias" />
                <NavItem href="/gestor/lista/pedidos" icon={<EnvelopeOpen size={18} />} label="Ver Pedidos" itemName="pedidos" />
              </div>
            </>
          )}

          {tipoUtilizador === "Formando" && (
            <>
              <div className="menu-section">
                <span className="menu-heading">PRINCIPAIS</span>
                <NavItem href="/" icon={<Flag size={18} />} label="Percurso Formativo" itemName="percurso" />
                <NavItem href="/" icon={<EnvelopeOpen size={18} />} label="Fórum" itemName="forum" />
              </div>
            </>
          )}

          {tipoUtilizador === "Formador" && (
            <>
              <div className="menu-section">
                <span className="menu-heading">PRINCIPAIS</span>
                <NavItem href="/formador/cursos" icon={<Flag size={18} />} label="Cursos a lecionar" itemName="form_cursos" />
              </div>
            </>
          )}
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