import React from "react";
import Button from "react-bootstrap/Button"; // Importando o componente Button
import { FaUser } from "react-icons/fa"; // Ícone de usuário
import "bootstrap/dist/css/bootstrap.min.css"; // Importando o CSS do Bootstrap

function NavbarButton({ text = "Login" }) {
  // Definindo o texto como prop, com valor padrão "Login"
  return (
    <div className="d-flex justify-content-center mt-5">
      <Button
        variant="light" // Fundo branco
        size="md" // Tamanho médio do botão
        className="text-dark d-flex justify-content-between align-items-center" // Alinhamento flex
        onClick={() => alert(`${text} clicked!`)}
      >
        {text} {/* Aqui o texto vem da prop */}
        <FaUser className="ms-2" /> {/* Ícone de login */}
      </Button>
    </div>
  );
}

export default NavbarButton;
