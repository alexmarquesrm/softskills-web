import React from "react";
import { Dropdown, Form } from "react-bootstrap";
import "./dropdown.css";

const DropdownCheckbox = ({
  label,
  options,
  selectedOptions,
  onChange,
  isMulti = true,
  useCheckboxUI = true,
}) => {
  const handleToggle = (value) => {
    if (isMulti) {
      if (selectedOptions.includes(value)) {
        onChange(selectedOptions.filter((item) => item !== value));
      } else {
        onChange([...selectedOptions, value]);
      }
    } else {
      if (selectedOptions.includes(value)) {
        onChange([]);
      } else {
        onChange([value]);
      }
    }
  };

  return (
    <Dropdown className="w-100">
      <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
        {selectedOptions.length > 0
          ? selectedOptions.join(", ")
          : label || "Selecionar"}
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100 border border-secondary-subtle rounded">
        {options.map((option) => (
          <Dropdown.ItemText
            key={option}
            as="div"
            className="px-2"
            onClick={() => !useCheckboxUI && handleToggle(option)}
          >
            {useCheckboxUI ? (
              <Form.Check
                type="checkbox"
                label={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleToggle(option)}
              />
            ) : (
              <span
                style={{
                  cursor: "pointer",
                  fontWeight: selectedOptions.includes(option) ? "600" : "normal",
                }}
              >
                {option}
              </span>
            )}
          </Dropdown.ItemText>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownCheckbox;
