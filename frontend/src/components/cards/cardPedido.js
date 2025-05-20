import React from 'react';
import Card from 'react-bootstrap/Card';
import { Calendar2, Person, Bookmark, Clock } from 'react-bootstrap-icons';
import "./cardPedido.css";

function CardPedido({ pedido = null, index, showFormador = false, showTimeAgo = false }) {
  const formatDate = (date) => {
    if (!date) return 'Indefinido';
    const data = new Date(date);
    if (isNaN(data.getTime())) return 'Indefinido';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const variants = [
    { bg: '#6366F1', light: '#EEF2FF', accent: '#4F46E5' },  // Indigo
    { bg: '#3B82F6', light: '#EFF6FF', accent: '#2563EB' },  // Blue
    { bg: '#06B6D4', light: '#ECFEFF', accent: '#0891B2' },  // Cyan
    { bg: '#10B981', light: '#ECFDF5', accent: '#059669' },  // Emerald
  ];
  const currentVariant = variants[index % variants.length];

  const getTimeStatus = (date) => {
    if (!date) return null;
    const dataInicio = new Date(date);
    if (isNaN(dataInicio.getTime())) return null;
    
    const hoje = new Date();
    const diffTime = dataInicio - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (showTimeAgo) {
      // Para o gestor: mostra há quanto tempo foi feito o pedido
      if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
      if (diffDays === 0) return 'Hoje';
      if (diffDays === 1) return 'Ontem';
      return `${diffDays} dias atrás`;
    } else {
      // Para o formador: mostra quanto tempo falta para começar
      if (diffDays < 0) return null;
      if (diffDays === 0) return 'Começa hoje';
      if (diffDays === 1) return 'Começa amanhã';
      return `Faltam ${diffDays} dias`;
    }
  };

  if (!pedido) return null;

  const titulo = pedido.titulo || 'N/A';
  const formador = pedido.formador || 'N/A';
  const data = formatDate(pedido.data);
  const timeStatus = getTimeStatus(pedido.data);
  const tipoLabel = pedido.tipoLabel || 'N/A';

  // Para o formador: não renderiza se o curso já começou
  if (!showTimeAgo && !timeStatus) return null;

  return (
    <Card className="card-pedido">
      <div className="card-color-bar" style={{ backgroundColor: currentVariant.bg }}></div>
      <Card.Body className="card-body-content">
        <div className="card-title-area">
          <div className="card-icon" style={{ backgroundColor: currentVariant.light, color: currentVariant.bg }}>
            <Bookmark />
          </div>
          <div className="card-title-container">
            <h5 className="card-title descricao-limitada" title={titulo}>
              {titulo}
            </h5>
            <span className="tipo-badge" style={{ 
              backgroundColor: pedido.tipo === 'CURSO' ? '#10B981' : '#6366F1',
              color: 'white'
            }}>
              {tipoLabel}
            </span>
          </div>
        </div>

        <div className="card-info">
          {showFormador && (
            <div className="info-item">
              <Person className="info-icon" />
              <span className="descricao-limitada" title={formador}>
                {formador}
              </span>
            </div>
          )}
          <div className="info-item">
            <Calendar2 className="info-icon" />
            <span>{data}</span>
          </div>
          {timeStatus && (
            <div className="days-ago" style={{ backgroundColor: currentVariant.light, color: currentVariant.accent }}>
              <Clock className="days-icon" />
              <span>{timeStatus}</span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardPedido;