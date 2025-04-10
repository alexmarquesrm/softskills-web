import React from 'react';
import { Form, Col, InputGroup } from 'react-bootstrap';

const InputField = ({ label, type, placeholder, name, value, onChange, icon, colSize, rows, style, readOnly,disable }) => {

  return (
    <Col md={colSize}>
      <Form.Group controlId={`form${name}`}>
        <Form.Label>{label}</Form.Label>
        <InputGroup>
          {icon && <InputGroup.Text>{icon}</InputGroup.Text>}
            <Form.Select 
              name={name}
              value={value}
              onChange={onChange}
              className="form-input"
              style={{ ...style }}
              readOnly={readOnly}
              disabled={disable}
            >
            </Form.Select>
        </InputGroup>
      </Form.Group>
    </Col>
  );
};

export default InputField;
