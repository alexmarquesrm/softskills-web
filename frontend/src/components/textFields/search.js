import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, handleSearchChange, handleSearchClick }) => {
  return (
    <InputGroup className="w-100">
      <FormControl 
        placeholder="Pesquisar..." 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />
      <Button variant="primary" onClick={handleSearchClick}>
        <FaSearch />
      </Button>
    </InputGroup>
  );
};

export default SearchBar;
