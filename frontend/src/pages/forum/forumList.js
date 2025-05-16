import React, { useState, useEffect } from 'react';
import axios from "../../config/configAxios";
import { Link } from 'react-router-dom';
import './forumList.css';

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get('/forum');
        setForums(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar fóruns');
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  if (loading) return <div className="loading">Carregando fóruns...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="forum-list-container">
      <div className="forum-header">
        <h1>Fóruns de Discussão</h1>
        <p className="forum-subtitle">Participe nas discussões e partilhe conhecimento</p>
      </div>

      <div className="forum-grid">
        {forums.map((forum) => (
          <div key={forum.forum_id} className="forum-card">
            <div className="forum-card-header">
              <div className="forum-category">
                <span className="category-label">Área:</span>
                <span className="category-value">{forum.forum_topico?.topico_area?.descricao || 'Não especificada'}</span>
              </div>
              <div className="forum-topic">
                <span className="topic-label">Tópico:</span>
                <span className="topic-value">{forum.forum_topico?.descricao || 'Não especificado'}</span>
              </div>
            </div>

            <div className="forum-card-body">
              <h2 className="forum-title">{forum.descricao}</h2>
              <div className="forum-stats">
                <div className="stat-item">
                  <i className="fas fa-comments"></i>
                  <span>{forum.thread_count || 0} Threads</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-users"></i>
                  <span>{forum.participant_count || 0} Participantes</span>
                </div>
              </div>
            </div>

            <div className="forum-card-footer">
              <Link to={`/forum/${forum.forum_id}`} className="view-forum-btn">
                Acessar Fórum
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumList; 