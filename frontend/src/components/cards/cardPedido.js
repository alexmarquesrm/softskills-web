import React from 'react';
import Card from 'react-bootstrap/Card';
import "./cardPedido.css";

function CardPedido({ pedido, index }) {
  const variants = [
    '#E1D2FF',  // Lavanda pastel
    '#FDE1AC',  // Amarelo pastel
    '#BAE5F5',  // Azul pastel
    '#CCEFBF',  // Verde pastel
  ];

  // Usar o índice para selecionar a cor
  const currentVariant = variants[index % variants.length];  // Garantir que o índice não ultrapasse o tamanho do array

  console.log(index);  // Deve agora mostrar o valor do index corretamente

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
          Dia do Pedido: {pedido?.data_pedido ?? 'Indefinido'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardPedido;
