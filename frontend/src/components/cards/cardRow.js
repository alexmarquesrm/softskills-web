import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import "./cardRow.css";

function CardRow({ dados = [], renderCard, colSize = 3, scrollable = false }) {
    const scrollContainerRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);
    
    const checkForButtons = () => {
        if (!scrollContainerRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // Adiciona uma pequena margem
    };
    
    useEffect(() => {
        if (scrollable && scrollContainerRef.current) {
            checkForButtons();
            // Verificar inicialmente se tem scroll
            setShowRightButton(
                scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth
            );
        }
    }, [scrollable, dados]);
    
    const handleScroll = () => {
        if (scrollable) {
            checkForButtons();
        }
    };
    
    const scrollLeft = () => {
        if (!scrollContainerRef.current) return;
        scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };
    
    const scrollRight = () => {
        if (!scrollContainerRef.current) return;
        scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    // Se scrollable for verdadeiro, usamos o layout horizontal
    if (scrollable) {
        return (
            <div className="card-row-scroll-wrapper">
                {showLeftButton && (
                    <Button 
                        className="scroll-button scroll-left" 
                        variant="light"
                        onClick={scrollLeft}
                    >
                        <ChevronLeft />
                    </Button>
                )}
                
                <div 
                    ref={scrollContainerRef} 
                    className="card-row-container"
                    onScroll={handleScroll}
                >
                    {dados.map((item, index) => (
                        <div key={index} className="card-row-item">
                            {renderCard(item, index)}
                        </div>
                    ))}
                </div>
                
                {showRightButton && (
                    <Button 
                        className="scroll-button scroll-right" 
                        variant="light"
                        onClick={scrollRight}
                    >
                        <ChevronRight />
                    </Button>
                )}
            </div>
        );
    }

    // Caso contrário, grid com colunas
    return (
        <Row className="g-3 justify-content-center card-row-grid">
            {dados.map((item, index) => (
                <Col key={index} md={colSize} className="d-flex card-col" style={{ maxWidth: '450px' }}>
                    <div className="w-100">
                        {renderCard(item, index)}
                    </div>
                </Col>
            ))}
        </Row>
    );
}

export default CardRow;