import React, { useState, useEffect } from "react";
import { Form, Card, Alert, Spinner } from "react-bootstrap";
import InputField from "../../components/textFields/basic";
import ModalCustom from "../modalCustom";
import Cancelar from "../../components/buttons/cancelButton";
import Guardar from "../../components/buttons/saveButton";
import { BsArrowReturnLeft } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import axios from "../../config/configAxios";

const AreaModal = ({ show, handleClose, area = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    descricao: "",
    categoria_id: ""
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (area) {
      setFormData({
        descricao: area.descricao || "",
        categoria_id: area.categoria_id || ""
      });
    } else {
      setFormData({
        descricao: "",
        categoria_id: ""
      });
    }
  }, [area]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categoria");
        setCategories(response.data);
        // Se estiver editando, verifica se a categoria existe na lista
        if (area && area.categoria_id) {
          const categoryExists = response.data.some(cat => cat.categoria_id === area.categoria_id);
          if (!categoryExists) {
            setError("A categoria associada a esta área não foi encontrada.");
          }
        }
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        setError("Erro ao carregar categorias. Tente novamente.");
      }
    };

    if (show) {
      fetchCategories();
    }
  }, [show]);

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
      if (area && area.area_id) {
        // Update existing area
        await axios.put(`/area/atualizar/${area.area_id}`, formData);
        if (onSuccess) {
          onSuccess("Área atualizada com sucesso!");
        }
      } else {
        // Create new area
        await axios.post("/area/criar", formData);
        if (onSuccess) {
          onSuccess("Área criada com sucesso!");
        }
      }
      
      handleClose();
    } catch (err) {
      console.error("Erro ao salvar área:", err);
      setError(err.response?.data?.message || "Erro ao salvar área. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom 
      show={show} 
      handleClose={handleClose} 
      title={area ? "Editar Área" : "Adicionar Área"}
    >
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          {success && <Alert variant="success" className="mb-4">Área salva com sucesso!</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category.categoria_id} value={category.categoria_id}>
                    {category.descricao}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <InputField 
              label="Descrição" 
              type="text" 
              name="descricao" 
              value={formData.descricao} 
              onChange={handleChange}
              placeholder="Digite a descrição da área"
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
              ) : area ? "Guardar Alterações" : "Adicionar Área"} 
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

export default AreaModal; 