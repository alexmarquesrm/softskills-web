import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaSearch } from 'react-icons/fa';
import AddButton from '../buttons/addButton';

import ModalAddUser from '../../modals/addUser'; 

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
                <AddButton
                    text={'Adicionar Utilizador'}
                    onClick={() => setShowModalAddUser(true)}
                    Icon={IoMdAddCircleOutline}
                />
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

            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 25 },
                        },
                    }}
                    pageSizeOptions={[25]}
                />
            </div>

           
            <ModalAddUser show={showModalAddUser} onClose={() => setShowModalAddUser(false)} />
        </div>
    );
}
