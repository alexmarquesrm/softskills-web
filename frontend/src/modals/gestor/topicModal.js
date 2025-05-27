import React, { useState, useEffect } from "react";
import { Form, Card, Alert, Spinner } from "react-bootstrap";
import InputField from "../../components/textFields/basic";
import ModalCustom from "../modalCustom";
import Cancelar from "../../components/buttons/cancelButton";
import Guardar from "../../components/buttons/saveButton";
import { BsArrowReturnLeft } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import axios from "../../config/configAxios";

const TopicModal = ({ show, handleClose, topic = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    descricao: "",
    area_id: ""
  });
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (topic) {
      setFormData({
        descricao: topic.descricao || "",
        area_id: topic.area_id || ""
      });
    } else {
      setFormData({
        descricao: "",
        area_id: ""
      });
    }
  }, [topic]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("/area");
        setAreas(response.data);
        // Se estiver editando, verifica se a área existe na lista
        if (topic && topic.area_id) {
          const areaExists = response.data.some(area => area.area_id === topic.area_id);
          if (!areaExists) {
            setError("A área associada a este tópico não foi encontrada.");
          }
        }
      } catch (err) {
        console.error("Erro ao buscar áreas:", err);
        setError("Erro ao carregar áreas. Tente novamente.");
      }
    };

    if (show) {
      fetchAreas();
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
      if (topic && topic.topico_id) {
        // Update existing topic
        await axios.put(`/topico/atualizar/${topic.topico_id}`, formData);
        if (onSuccess) {
          onSuccess("Tópico atualizado com sucesso!");
        }
      } else {
        // Create new topic
        await axios.post("/topico/criar", formData);
        if (onSuccess) {
          onSuccess("Tópico criado com sucesso!");
        }
      }
      
      handleClose();
    } catch (err) {
      console.error("Erro ao salvar tópico:", err);
      setError(err.response?.data?.message || "Erro ao salvar tópico. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom 
      show={show} 
      handleClose={handleClose} 
      title={topic ? "Editar Tópico" : "Adicionar Tópico"}
    >
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          {success && <Alert variant="success" className="mb-4">Tópico salvo com sucesso!</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Área</Form.Label>
              <Form.Select
                name="area_id"
                value={formData.area_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma área</option>
                {areas.map(area => (
                  <option key={area.area_id} value={area.area_id}>
                    {area.descricao}
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
              placeholder="Digite a descrição do tópico"
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
              ) : topic ? "Guardar Alterações" : "Adicionar Tópico"} 
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

export default TopicModal; 