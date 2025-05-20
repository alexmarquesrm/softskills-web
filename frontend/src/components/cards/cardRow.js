import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import "./cardRow.css";

function CardRow({ dados = [], renderCard, colSize = 3, scrollable = false, align = "center", emptyStateMessage = "Nenhum item encontrado" }) {
    const scrollContainerRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);
    
    const checkForButtons = () => {
        if (!scrollContainerRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    };
    
    useEffect(() => {
        if (scrollable && scrollContainerRef.current) {
            checkForButtons();
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

    if (!dados || dados.length === 0) {
        return (
            <div className="empty-state text-center">
                <p>{emptyStateMessage}</p>
            </div>
        );
    }

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

    const alignmentClass = {
        start: "justify-content-start",
        center: "justify-content-center",
        end: "justify-content-end"
    }[align] || "justify-content-center";
    
    return (
        <Row className={`g-3 ${alignmentClass} card-row-grid`}>
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