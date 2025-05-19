import React, { useState, useEffect } from 'react';
import axios from "../../config/configAxios";
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, Users, ArrowLeft, Plus, User } from 'react-feather';
import { Container, Row, Col } from 'react-bootstrap';
import './forumDetail.css';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

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
      <Container fluid className="page-container">
        <div className="forum-header">
          <div className="forum-header-content">
            <div className="forum-header-icon">
              <MessageSquare size={32} />
            </div>
            <div className="forum-header-info">
              <h1>{forum.descricao}</h1>
              <p className="forum-subtitle">Participe das discussões e compartilhe conhecimento</p>
            </div>
          </div>
          <Link to="/forum" className="back-btn">
            <ArrowLeft size={16} />
            Voltar aos Fóruns
          </Link>
        </div>

        <Row className="forum-content">
          <Col lg={12}>
            <div className="threads-section">
              <div className="threads-header">
                <div className="threads-header-content">
                  <h2>Threads</h2>
                  <Link to={`/forum/${id}/create-thread`} className="create-thread-btn">
                    <Plus size={16} />
                    Criar Nova Thread
                  </Link>
                </div>
              </div>

              <div className="threads-grid">
                {threads.length === 0 ? (
                  <p className="no-threads">Nenhuma thread encontrada neste fórum.</p>
                ) : (
                  threads.map((thread) => (
                    <div key={thread.thread_id} className="thread-card">
                      <div className="thread-card-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <h3 className="thread-title" style={{ margin: 0, display: 'flex', alignItems: 'center' }}>{thread.titulo}</h3>
                          <span style={{ color: '#666', fontSize: '0.9rem' }}>•</span>
                          <span style={{ 
                            color: '#2b4c7e', 
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            letterSpacing: '0.3px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center'
                          }}>{thread.user?.nome || 'Anônimo'}</span>
                          {thread.created_at && (
                            <span style={{ color: '#666', fontSize: '0.9rem', marginLeft: 'auto' }}>{formatDate(thread.created_at)}</span>
                          )}
                        </div>
                        <p className="thread-description">{thread.descricao}</p>
                        <div className="thread-stats">
                          <div className="thread-stat">
                            <MessageSquare size={16} />
                            <span>{thread.comment_count || 0} Comentários</span>
                          </div>
                          <div className="thread-stat">
                            <Users size={16} />
                            <span>{thread.voto_count || 0} Votos</span>
                          </div>
                        </div>
                      </div>

                      <div className="thread-card-footer">
                        <Link to={`/forum/${id}/thread/${thread.thread_id}`} className="view-thread-btn">
                          Ver Thread
                          <ArrowLeft size={16} />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForumDetail; 