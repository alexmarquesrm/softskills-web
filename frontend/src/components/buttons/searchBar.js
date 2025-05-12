import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    //console.log("Searching for:", searchTerm);
  };

  return (
    <div className="d-flex justify-content-center">
      <InputGroup className="mb-3" style={{ width: '300px' }}>
        <FormControl
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
        />
        <Button variant="primary" onClick={handleSearch}>
          <FaSearch />
        </Button>
      </InputGroup>
    </div>
  );
}

export default SearchBar;
