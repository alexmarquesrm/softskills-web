import React, { useState, useEffect } from "react";
import { Form, Card, Alert, Spinner } from "react-bootstrap";
import InputField from "../../components/textFields/basic";
import ModalCustom from "../modalCustom";
import Cancelar from "../../components/buttons/cancelButton";
import Guardar from "../../components/buttons/saveButton";
import { BsArrowReturnLeft } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import axios from "../../config/configAxios";

const CategoryModal = ({ show, handleClose, category = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    descricao: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        descricao: category.descricao
      });
    } else {
      setFormData({
        descricao: ""
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (category && category.categoria_id) {
        // Update existing category
        await axios.put(`/categoria/atualizar/${category.categoria_id}`, formData);
        if (onSuccess) {
          onSuccess("Categoria atualizada com sucesso!");
        }
      } else {
        // Create new category
        await axios.post("/categoria/criar", formData);
        if (onSuccess) {
          onSuccess("Categoria criada com sucesso!");
        }
      }
      
      handleClose();
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      setError(err.response?.data?.message || "Erro ao salvar categoria. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom 
      show={show} 
      handleClose={handleClose} 
      title={category ? "Editar Categoria" : "Adicionar Categoria"}
    >
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          {success && <Alert variant="success" className="mb-4">{success}</Alert>}

          <Form>
            <InputField 
              label="Descrição" 
              type="text" 
              name="descricao" 
              value={formData.descricao} 
              onChange={handleChange}
              placeholder="Digite a descrição da categoria"
              required
            />
          </Form>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Cancelar text="Cancelar" onClick={handleClose} Icon={BsArrowReturnLeft} inline={true} />
            <Guardar 
              text={loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  A guardar...
                </>
              ) : category ? "Guardar Alterações" : "Adicionar Categoria"} 
              onClick={handleSubmit} 
              Icon={loading ? null : FaRegSave}
              disabled={loading}
            />
          </div>
        </Card.Body>
      </Card>
    </ModalCustom>
  );
};

export default CategoryModal; 