import React from 'react';
import Card from 'react-bootstrap/Card';
import "./cardPedido.css";

function CardPedido({ pedido, index }) {
  const formatDate = (date) => {
    const data = new Date(date);
    return data.toISOString().split('T')[0];
  };
  
  const variants = [
    '#E1D2FF',  // Lavanda pastel
    '#FDE1AC',  // Amarelo pastel
    '#BAE5F5',  // Azul pastel
    '#CCEFBF',  // Verde pastel
  ];

  // Usar o índice para selecionar a cor
  const currentVariant = variants[index % variants.length];

  return (
    <Card
      style={{ backgroundColor: currentVariant, width: '100%', minWidth: '16rem', color: '#3B3B3B' }}
      className="mb-3"
    >
      <Card.Header>
        <div className="descricao-limitada" title={pedido.ped_curso?.titulo}>
          {pedido?.ped_curso?.titulo ?? 'N/A'}
        </div>
      </Card.Header>

      <Card.Body>
        <Card.Text>
          <div className="descricao-limitada" title={pedido.ped_formador?.formador_colab?.nome}>
            Pedido por: {pedido?.ped_formador?.formador_colab?.nome ?? 'N/A'}
          </div>
        </Card.Text>
        <Card.Text>
          Data do Pedido: {formatDate(pedido?.data ?? 'Indefenido')}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardPedido;
