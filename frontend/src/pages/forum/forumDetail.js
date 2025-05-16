import React, { useState, useEffect } from 'react';
import axios from "../../config/configAxios";
import { useParams, Link } from 'react-router-dom';
import './forumDetail.css';

const ForumDetail = () => {
  const { id } = useParams();
  const [forum, setForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForumAndThreads = async () => {
      try {
        const [forumResponse, threadsResponse] = await Promise.all([
          axios.get(`/forum/${id}`),
          axios.get(`/thread`)
        ]);
        setForum(forumResponse.data);
        setThreads(threadsResponse.data.filter(thread => thread.forum_id === parseInt(id)));
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar fórum e threads');
        setLoading(false);
      }
    };

    fetchForumAndThreads();
  }, [id]);

  if (loading) return <div className="loading">Carregando fórum...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!forum) return <div className="error">Fórum não encontrado</div>;

  return (
    <div className="forum-detail-container">
      <div className="forum-header">
        <h1>{forum.descricao}</h1>
        <Link to="/forum" className="back-btn">Voltar aos Fóruns</Link>
      </div>

      <div className="threads-section">
        <div className="threads-header">
          <h2>Threads</h2>
          <Link to={`/forum/${id}/create-thread`} className="create-thread-btn">
            Criar Nova Thread
          </Link>
        </div>

        <div className="threads-list">
          {threads.length === 0 ? (
            <p className="no-threads">Nenhuma thread encontrada neste fórum.</p>
          ) : (
            threads.map((thread) => (
              <div key={thread.thread_id} className="thread-card">
                <div className="thread-info">
                  <h3>{thread.titulo}</h3>
                  <p className="thread-description">{thread.descricao}</p>
                  <div className="thread-meta">
                    <span>Autor: {thread.user_id?.credenciais_colaborador?.nome || 'Anônimo'}</span>
                    <span>Votos: {thread.voto_count || 0}</span>
                  </div>
                </div>
                <Link to={`/forum/${id}/thread/${thread.thread_id}`} className="view-thread-btn">
                  Ver Thread
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDetail; 