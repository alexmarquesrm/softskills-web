import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function StatsSection() {
  return (
    <Container className="text-center my-5">
      <Row>
        <Col md={4}>
          <h3>25K+</h3>
          <p>Active Students</p>
        </Col>
        <Col md={4}>
          <h3>899</h3>
          <p>Total Courses</p>
        </Col>
        <Col md={4}>
          <h3>158</h3>
          <p>Instructors</p>
        </Col>
      </Row>
    </Container>
  );
}

export default StatsSection;
