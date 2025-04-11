import React from "react";
import { Row, Col } from "react-bootstrap";
import "./cardRow.css";

function CardRow({ dados = [], renderCard, colSize = 3, scrollable = false }) {
    // Se scrollable for verdadeiro, usamos o layout horizontal
    if (scrollable) {
        return (
            <div className="card-row-container">
                {dados.map((item, index) => (
                    <div key={index} className="card-row-item">
                        {renderCard(item, index)}
                    </div>
                ))}
            </div>
        );
    }

    // Caso contrário, grid com colunas
    return (
        <Row className="g-3 justify-content-center">
            {dados.map((item, index) => (
                <Col key={index} md={colSize} className="d-flex" style={{ maxWidth: '450px' }}>
                    <div className="w-100">
                        {renderCard(item, index)}
                    </div>
                </Col>
            ))}
        </Row>
    );
}

export default CardRow;
