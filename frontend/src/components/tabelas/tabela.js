import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Button, InputGroup, FormControl, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Botao from "../buttons/botao";
import { FaPencilAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";




function UsersTable() {
  const [users] = useState([
    { name: "Tiago Carvalho", permissions: "Formador" },
    { name: "Patricia Carvalho", permissions: "Gestor" },
    { name: "Rodrigo Marques", permissions: "Formando" },
    { name: "Francisco Vitorino", permissions: "Formando" },
    { name: "João Santos", permissions: "Formando" },
    { name: "Tiago Carvalho", permissions: "Gestor" },
    { name: "Francisco Vitorino", permissions: "Formando" },
    { name: "Tiago Carvalho", permissions: "Gestor" },
    { name: "Tiago Carvalho", permissions: "Formador" },
    { name: "Francisco Vitorino", permissions: "Formando" },
    { name: "Rodrigo Marques", permissions: "Formando" },
    { name: "Rodrigo Marques", permissions: "Formando" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <h3>Utilizadores</h3>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <Botao text={'Adicionar Utilizador'}onClick={() => alert("Botão clicado")} Icon={IoMdAddCircleOutline}/>
        <div className="ms-2" style={{ flex: 1 }}>
          <InputGroup className="w-100">
            <FormControl
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="primary">
              <FaSearch />
            </Button>
          </InputGroup>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Permissões</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr>
              <td>{user.name}</td>
              <td>{user.permissions}</td>
              <td>
                <Botao  onClick={() => alert("Botão clicado")} Icon={FaPencilAlt} />
                 
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UsersTable;
