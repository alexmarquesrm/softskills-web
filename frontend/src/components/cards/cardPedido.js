import React from 'react';
import Card from 'react-bootstrap/Card';
import { Calendar2, Person, Bookmark, Clock } from 'react-bootstrap-icons';
import "./cardPedido.css";

function CardPedido({ pedido, index }) {
  const formatDate = (date) => {
    if (!date || date === 'Indefenido') return 'Indefinido';
    const data = new Date(date);
    return data.toISOString().split('T')[0].replace(/-/g, '/');
  };
  
  // Cores de cards mais modernas e com melhor contraste
  const variants = [
    { bg: '#6366F1', light: '#EEF2FF', accent: '#4F46E5' },  // Indigo
    { bg: '#3B82F6', light: '#EFF6FF', accent: '#2563EB' },  // Blue
    { bg: '#06B6D4', light: '#ECFEFF', accent: '#0891B2' },  // Cyan
    { bg: '#10B981', light: '#ECFDF5', accent: '#059669' },  // Emerald
  ];

  // Usar o índice para selecionar a cor
  const currentVariant = variants[index % variants.length];
  
  // Calcular quantos dias atrás foi o pedido
  const getDaysAgo = (date) => {
    if (!date || date === 'Indefenido') return null;
    const pedidoDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - pedidoDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };
  
  const daysAgo = getDaysAgo(pedido?.data);
  const curso = pedido?.ped_curso?.titulo ?? 'N/A';
  const formador = pedido?.ped_formador?.formador_colab?.nome ?? 'N/A';
  const data = formatDate(pedido?.data ?? 'Indefinido');

  return (
    <Card className="card-pedido">
      <div className="card-color-bar" style={{ backgroundColor: currentVariant.bg }}></div>
      <Card.Body className="card-body-content">
        <div className="card-title-area">
          <div className="card-icon" style={{ backgroundColor: currentVariant.light, color: currentVariant.bg }}>
            <Bookmark />
          </div>
          <h5 className="card-title descricao-limitada" title={curso}>
            {curso}
          </h5>
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