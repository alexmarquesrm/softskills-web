import React, { useState, useEffect } from 'react';
import axios from "../../config/configAxios";
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, ThumbsUp, ThumbsDown, Flag, Send, User } from 'react-feather';
import { Container, Row, Col } from 'react-bootstrap';
import './threadDetail.css';

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

const ThreadDetail = () => {
  const { id, threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteStatus, setVoteStatus] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyComment, setReplyComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [threadResponse, commentsResponse] = await Promise.all([
          axios.get(`/thread/${threadId}`),
          axios.get(`/comentario/thread/${threadId}`)
        ]);
        setThread(threadResponse.data);
        setComments(commentsResponse.data);
        // Buscar info do fórum para mostrar nome
        const forumId = threadResponse.data.forum_id || id;
        const forumResponse = await axios.get(`/forum/${forumId}`);
        setForum(forumResponse.data);

        // Check if user has already voted
        const colaborador_id = sessionStorage.getItem('colaboradorid');
        if (colaborador_id) {
          try {
            const formandoResponse = await axios.get(`/formando/${colaborador_id}`);
            if (formandoResponse.data && formandoResponse.data.formando_id) {
              const voteResponse = await axios.get(`/threadsAva/${threadId}/${formandoResponse.data.formando_id}`);
              if (voteResponse.data) {
                const voteValue = parseInt(voteResponse.data.vote);
                setVoteStatus(voteValue);
              }
            }
          } catch (err) {
            console.log('Error checking vote:', err);
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar thread e comentários');
        setLoading(false);
      }
    };
    fetchData();
  }, [threadId, id]);

  const handleVote = async (voteValue) => {
    try {
      const token = sessionStorage.getItem('token');
      const tipo = sessionStorage.getItem('tipo');
      const colaborador_id = sessionStorage.getItem('colaboradorid');
      if (!token) throw new Error('Utilizador não autenticado');
      if (tipo !== 'Formando') throw new Error('Apenas formandos podem votar nas threads');
      if (!colaborador_id) throw new Error('ID do colaborador não encontrado');
      const formandoResponse = await axios.get(`/formando/${colaborador_id}`);
      if (!formandoResponse.data || !formandoResponse.data.formando_id) throw new Error('Formando não encontrado');
      const voteData = {
        thread_id: parseInt(threadId),
        formando_id: formandoResponse.data.formando_id,
        vote: voteValue
      };
      const response = await axios.post('/threadsAva/criar', voteData);
      // If the response indicates the vote was removed, set voteStatus to null
      if (response.data.avaliacao === null) {
        setVoteStatus(null);
      } else {
        setVoteStatus(voteValue);
      }
      const threadResponse = await axios.get(`/thread/${threadId}`);
      setThread(threadResponse.data);
    } catch (err) {
      setError(err.message || 'Erro ao votar na thread');
    }
  };

  const handleReport = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const tipo = sessionStorage.getItem('tipo');
      const colaborador_id = sessionStorage.getItem('colaboradorid');
      if (!token) throw new Error('Utilizador não autenticado');
      if (tipo !== 'Formando') throw new Error('Apenas formandos podem denunciar threads');
      if (!colaborador_id) throw new Error('ID do colaborador não encontrado');
      const formandoResponse = await axios.get(`/formando/colaborador/${colaborador_id}`);
      if (!formandoResponse.data || !formandoResponse.data.formando_id) throw new Error('Formando não encontrado');
      const reportData = {
        thread_id: parseInt(threadId),
        formando_id: formandoResponse.data.formando_id,
        descricao: 'Denúncia de conteúdo inapropriado'
      };
      await axios.post('/denuncia/criar', reportData);
      alert('Denúncia enviada com sucesso');
    } catch (err) {
      setError(err.message || 'Erro ao enviar denúncia');
    }
  };

  const handleCommentSubmit = async (e, replyToId = null) => {
    e.preventDefault();
    try {
      const colaborador_id = sessionStorage.getItem('colaboradorid');
      if (!colaborador_id) throw new Error('Utilizador não autenticado');
      const commentData = {
        thread_id: parseInt(threadId),
        colaborador_id: parseInt(colaborador_id),
        descricao: replyToId ? replyComment : newComment,
        comentariopai_id: replyToId || replyTo
      };
      await axios.post('/comentario/criar', commentData);
      setNewComment('');
      setReplyComment('');
      setReplyTo(null);
      const commentsResponse = await axios.get(`/comentario/thread/${threadId}`);
      setComments(commentsResponse.data);
    } catch (err) {
      setError(err.message || 'Erro ao adicionar comentário');
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    setReplyComment('');
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyComment('');
  };

  const renderComment = (comment) => {
    return (
      <div key={comment.comentario_id} className="comment-card">
        <div className="comment-card-header">
          <div className="comment-author">
            <span className="author-label">Autor:</span>
            <span className="author-value">{comment.colab_comentarios.nome}</span>
          </div>
          {comment.colab_comentarios.cargo && (
            <div className="comment-role">
              <span className="role-label">Cargo:</span>
              <span className="role-value">{comment.colab_comentarios.cargo}</span>
            </div>
          )}
        </div>
        <div className="comment-card-body">
          <p className="comment-content">{comment.descricao}</p>
        </div>
        <div className="comment-card-footer">
          <button onClick={() => handleReply(comment.comentario_id)} className="reply-btn">
            <MessageSquare size={16} />
            Responder
          </button>
        </div>
        {replyTo === comment.comentario_id && (
          <div className="reply-form">
            <textarea
              value={replyComment}
              onChange={(e) => setReplyComment(e.target.value)}
              placeholder="Escreva sua resposta..."
              required
            />
            <div className="reply-form-actions">
              <button onClick={handleCancelReply} className="cancel-reply-btn">
                Cancelar
              </button>
              <button onClick={(e) => handleCommentSubmit(e, comment.comentario_id)} className="submit-reply-btn">
                <Send size={16} />
                Enviar Resposta
              </button>
            </div>
          </div>
        )}
        {comment.respostas && comment.respostas.length > 0 && (
          <div className="replies">
            {comment.respostas.map(reply => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="loading">Carregando thread...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!thread) return <div className="error">Thread não encontrada</div>;

  // Exemplo de tags/categorias (ajuste conforme seu modelo)
  const tags = thread.categorias || thread.tags || [];

  return (
    <div className="thread-detail-container">
      <Container fluid className="page-container">
        <div className="thread-header">
          <div className="thread-header-content">
            <div className="thread-header-avatar">
              {thread.user?.nome ? (
                <span className="avatar-circle">{getInitials(thread.user.nome)}</span>
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="thread-header-info">
              <div className="thread-header-meta">
                {forum && <span className="forum-name">{forum.descricao}</span>}
                <span className="author-name">{thread.user?.nome || 'Anônimo'}</span>
                <span className="post-time">{formatDate(thread.created_at)}</span>
              </div>
              <h1>{thread.titulo}</h1>
              {tags.length > 0 && (
                <div className="thread-tags">
                  {tags.map((tag, idx) => (
                    <span className="tag" key={idx}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={() => navigate(`/forum/${id}`)} className="back-btn">
            <ArrowLeft size={16} />
            Voltar ao Fórum
          </button>
        </div>
        <Row className="thread-content">
          <div className="thread-card">
            <div className="thread-card-body">
              <p className="thread-description">{thread.descricao}</p>
              <div className="thread-actions" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}>
                <div className="vote-section" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleVote(1)}
                    className={`vote-btn ${voteStatus === 1 ? 'voted' : ''}`}
                    title="Upvote"
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <span className="vote-count">{thread.voto_count || 0}</span>
                  <button
                    onClick={() => handleVote(-1)}
                    className={`vote-btn ${voteStatus === -1 ? 'voted' : ''}`}
                    title="Downvote"
                  >
                    <ThumbsDown size={16} />
                  </button>
                </div>
              </div>
            </div>
            <button onClick={handleReport} className="report-btn">
              <Flag size={16} />
              Denunciar
            </button>
          </div>
          <div className="comments-section">
            <h2>Comentários</h2>
            <div className="new-comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva seu comentário..."
                required
              />
              <button onClick={(e) => handleCommentSubmit(e)} className="submit-comment-btn">
                <Send size={16} />
                Enviar Comentário
              </button>
            </div>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              ) : (
                comments.map(comment => renderComment(comment))
              )}
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default ThreadDetail; 