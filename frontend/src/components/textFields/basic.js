import React from 'react';
import { Form, Col, InputGroup } from 'react-bootstrap';

const InputField = ({  label,  type,  placeholder,  name,  value,  onChange,  icon,  endIcon,   onEndIconClick,   colSize,  rows,  style,  disable,  readOnly, error}) => {
  return (
    <Col md={colSize}>
      <Form.Group controlId={`form${name}`}>
        <Form.Label>{label}</Form.Label>
        <InputGroup>
          {icon && <InputGroup.Text>{icon}</InputGroup.Text>}
          <Form.Control
            as={type === 'textarea' ? 'textarea' : 'input'}
            type={type}
            rows={type === 'textarea' && rows ? rows : undefined}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            className="form-input"
            style={{ ...style }}
            readOnly={readOnly}
            disabled={disable}
            isInvalid={!!error}
          />
          {endIcon && (
            <InputGroup.Text
              style={{ cursor: 'pointer' }}
              onClick={onEndIconClick}
            >
              {endIcon}
            </InputGroup.Text>
          )}
        </InputGroup>
      </Form.Group>
    </Col>
  );
};

export default InputField;
