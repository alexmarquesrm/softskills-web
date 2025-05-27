import React from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { Calendar2, Clock, FileEarmarkText, ExclamationTriangle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "./cardPedido.css";

function CardTrabalho({ trabalho = null, index }) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return 'Indefinido';
    const data = new Date(date);
    if (isNaN(data.getTime())) return 'Indefinido';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
  };

  const variants = [
    { bg: '#DC3545', light: '#F8D7DA', accent: '#C82333' },  // Red
    { bg: '#FD7E14', light: '#FFE5CC', accent: '#E55A00' },  // Orange
    { bg: '#FFC107', light: '#FFF3CD', accent: '#E0A800' },  // Yellow
    { bg: '#6F42C1', light: '#E2D9F3', accent: '#59359A' },  // Purple
  ];
  const currentVariant = variants[index % variants.length];

  const getTimeStatus = (date) => {
    if (!date) return null;
    const dataEntrega = new Date(date);
    if (isNaN(dataEntrega.getTime())) return null;
    
    const hoje = new Date();
    
    // Calcula diferença em dias
    const diffTime = dataEntrega - hoje;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Prazo expirado';
    if (diffDays === 0) {
      // Se for hoje, verifica a hora
      const diffHoras = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (diffHoras <= 0) return 'Prazo hoje';
      return `${diffHoras}h restantes`;
    }
    if (diffDays === 1) return 'Entrega amanhã';
    if (diffDays <= 7) return `${diffDays} dias restantes`;
    return `${diffDays} dias restantes`;
  };

  const getUrgencyLevel = (date) => {
    if (!date) return 'normal';
    const dataEntrega = new Date(date);
    const hoje = new Date();
    const diffTime = dataEntrega - hoje;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'normal';
  };

  const handleCardClick = () => {
    if (trabalho?.curso_id) {
      navigate(`/utilizadores/curso/${trabalho.curso_id}`);
    }
  };

  if (!trabalho) return null;

  const titulo = trabalho.titulo || 'N/A';
  const cursoTitulo = trabalho.curso_titulo || 'N/A';
  const data = formatDate(trabalho.data_entrega);
  const timeStatus = getTimeStatus(trabalho.data_entrega);
  const urgencyLevel = getUrgencyLevel(trabalho.data_entrega);

  return (
    <Card className="card-pedido" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card-color-bar" style={{ backgroundColor: currentVariant.bg }}></div>
      <Card.Body className="card-body-content">
        <div className="card-title-area">
          <div className="card-icon" style={{ backgroundColor: currentVariant.light, color: currentVariant.bg }}>
            <FileEarmarkText />
          </div>
          <div className="card-title-container">
            <h5 className="card-title descricao-limitada" title={titulo}>
              {titulo}
            </h5>
            <small className="text-muted descricao-limitada" title={cursoTitulo}>
              {cursoTitulo}
            </small>
          </div>
        </div>

        <div className="card-info">
          <div className="info-item">
            <Calendar2 className="info-icon" />
            <span>Prazo: {data}</span>
          </div>
          {timeStatus && (
            <div className="days-ago" style={{ 
              backgroundColor: urgencyLevel === 'urgent' ? '#DC3545' : 
                             urgencyLevel === 'warning' ? '#FFC107' : 
                             currentVariant.light,
              color: urgencyLevel === 'urgent' ? 'white' : 
                     urgencyLevel === 'warning' ? '#000' : 
                     currentVariant.accent 
            }}>
              {urgencyLevel === 'urgent' && <ExclamationTriangle className="days-icon" />}
              {urgencyLevel !== 'urgent' && <Clock className="days-icon" />}
              <span>{timeStatus}</span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardTrabalho; 