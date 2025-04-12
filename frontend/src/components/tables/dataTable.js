import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

export default function DataTable({ columns, rows }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModalAddUser, setShowModalAddUser] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRows = rows.filter((row) =>
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
                <div className="ms-2" style={{ flex: 1 }}>
                   
                </div>
            </div>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid rows={filteredRows} columns={columns} initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 25 }, },
                }} pageSizeOptions={[25]} />
            </div>
        </div>
    );
}
