import React from 'react';
import Card from 'react-bootstrap/Card';
import { Calendar2, Person, Bookmark, Clock } from 'react-bootstrap-icons';
import "./cardPedido.css";

function CardPedido({ pedido = null, index }) {
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

  const getDaysAgo = (date) => {
    if (!date) return null;
    const pedidoDate = new Date(date);
    if (isNaN(pedidoDate.getTime())) return null;
    const today = new Date();
    const diffTime = Math.abs(today - pedidoDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  if (!pedido) return null;

  const titulo = pedido.titulo || 'N/A';
  const formador = pedido.formador || 'N/A';
  const data = formatDate(pedido.data);
  const daysAgo = getDaysAgo(pedido.data);
  const tipoLabel = pedido.tipoLabel || 'N/A';

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
          <div className="info-item">
            <Person className="info-icon" />
            <span className="descricao-limitada" title={formador}>
              {formador}
            </span>
          </div>
          <div className="info-item">
            <Calendar2 className="info-icon" />
            <span>{data}</span>
          </div>
          {daysAgo && (
            <div className="days-ago" style={{ backgroundColor: currentVariant.light, color: currentVariant.accent }}>
              <Clock className="days-icon" />
              <span>{daysAgo}</span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardPedido;