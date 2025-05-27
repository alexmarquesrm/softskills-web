import React, { useState } from 'react';
import axios from "../../config/configAxios";
import { useParams, useNavigate } from 'react-router-dom';
import './createThread.css';

const CreateThread = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the current user's ID from localStorage or your auth context
      const colaborador_id = sessionStorage.getItem('colaboradorid');
      if (!colaborador_id) {
        throw new Error('Utilizador não autenticado');
      }

      const threadData = {
        ...formData,
        forum_id: parseInt(id),
        colaborador_id: parseInt(colaborador_id)
      };

      await axios.post('/thread/criar', threadData);
      navigate(`/forum/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar thread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-thread-container">
      <h1>Criar Nova Thread</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="create-thread-form">
        <div className="form-group">
          <label htmlFor="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Digite o título da thread"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            placeholder="Digite a descrição da thread"
            rows="6"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/forum/${id}`)}
            className="cancel-btn"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Thread'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateThread; 