import React, { useState } from 'react';
import { Table, Pagination, InputGroup, FormControl, Button } from 'react-bootstrap';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { FaSearch } from 'react-icons/fa';
import Botao from '../buttons/button';

export default function DataTable({ columns, rows }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const pageSize = 25;

    const totalPages = Math.ceil(rows.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentRows = rows.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRows = currentRows.filter((row) =>
        columns.some((column) => 
            String(row[column.field]).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="container mt-5">
            <div className="mb-3">
                <h3>Lista de Colaboradores</h3>
            </div>
            <div className="d-flex justify-content-between mb-3">
            <Botao text={'Adicionar Utilizador'} onClick={() => alert("Botão clicado")} Icon={IoMdAddCircleOutline}/>
                <div className="ms-2" style={{ flex: 1 }}>
                    <InputGroup className="w-100">
                        <FormControl
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <Button variant="primary">
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </div>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.field}>{column.headerName}</th>
                        ))}
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.map((row, index) => (
                        <tr key={index}>
                            {columns.map((column) => (
                                <td key={column.field}>{row[column.field]}</td>
                            ))}
                            <td>
                                <Botao
                                    onClick={() => alert("Botão clicado")}
                                    Icon={FaPencilAlt}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginação */}
            <Pagination>
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                <Pagination.Item>{currentPage}</Pagination.Item>
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    );
}
