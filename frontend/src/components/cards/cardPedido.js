import React from 'react';
import Card from 'react-bootstrap/Card';
import { Calendar2, Person, Bookmark, Clock } from 'react-bootstrap-icons';
import "./cardPedido.css";

function CardPedido({ pedido = null, curso = null, index }) {
  const formatDate = (date) => {
    if (!date || date === 'Indefenido') return 'Indefinido';
    const data = new Date(date);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
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
    if (!date || date === 'Indefenido') return null;
    const pedidoDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - pedidoDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  const getDaysUntil = (date) => {
    if (!date || date === 'Indefenido') return null;
    const targetDate = new Date(date);
    const today = new Date();

    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Já começou';
    if (diffDays === 0) return 'Começa hoje';
    if (diffDays === 1) return 'Começa amanhã';
    return `Começa em ${diffDays} dias`;
  };

  // Detectar se é um pedido ou curso
  const isPedido = !!pedido;
  const titulo = isPedido
    ? pedido?.ped_curso?.titulo ?? 'N/A'
    : curso?.titulo ?? 'N/A';
  const formador = isPedido
    ? pedido?.ped_formador?.formador_colab?.nome ?? 'N/A'
    : curso?.curso_sincrono?.[0]?.sincrono_formador?.formador_colab?.nome ?? 'N/A';
  const dataRaw = isPedido ? pedido?.data : curso?.curso_sincrono?.data_inicio;
  const data = formatDate(dataRaw);
  const daysAgo = isPedido ? getDaysAgo(dataRaw) : getDaysUntil(dataRaw);

  return (
    <Card className="card-pedido">
      <div className="card-color-bar" style={{ backgroundColor: currentVariant.bg }}></div>
      <Card.Body className="card-body-content">
        <div className="card-title-area">
          <div className="card-icon" style={{ backgroundColor: currentVariant.light, color: currentVariant.bg }}>
            <Bookmark />
          </div>
          <h5 className="card-title descricao-limitada" title={titulo}>
            {titulo}
          </h5>
        </div>

        <div className="card-info">
          {isPedido && (
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