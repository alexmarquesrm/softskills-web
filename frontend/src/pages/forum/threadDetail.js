import React, { useState, useEffect } from 'react';
import axios from "../../config/configAxios";
import { useParams, useNavigate } from 'react-router-dom';
import './threadDetail.css';

const ThreadDetail = () => {
  const { id, threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteStatus, setVoteStatus] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyComment, setReplyComment] = useState('');

  useEffect(() => {
    const fetchThreadAndComments = async () => {
      try {
        const [threadResponse, commentsResponse] = await Promise.all([
          axios.get(`/thread/${threadId}`),
          axios.get(`/comentario/thread/${threadId}`)
        ]);
        setThread(threadResponse.data);
        setComments(commentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar thread e comentários');
        setLoading(false);
      }
    };

    fetchThreadAndComments();
  }, [threadId]);

  const handleVote = async (voteValue) => {
    try {
      const token = sessionStorage.getItem('token');
      const tipo = sessionStorage.getItem('tipo');
      const colaborador_id = sessionStorage.getItem('colaboradorid');

      if (!token) {
        throw new Error('Utilizador não autenticado');
      }

      if (tipo !== 'Formando') {
        throw new Error('Apenas formandos podem votar nas threads');
      }

      if (!colaborador_id) {
        throw new Error('ID do colaborador não encontrado');
      }

      const formandoResponse = await axios.get(`/formando/${colaborador_id}`);
      if (!formandoResponse.data || !formandoResponse.data.formando_id) {
        throw new Error('Formando não encontrado');
      }

      const voteData = {
        thread_id: parseInt(threadId),
        formando_id: formandoResponse.data.formando_id,
        vote: voteValue
      };

      await axios.post('/threadsAva/criar', voteData);
      setVoteStatus(voteValue);
      
      const threadResponse = await axios.get(`/thread/${threadId}`);
      setThread(threadResponse.data);
    } catch (err) {
      console.error('Erro ao votar:', err);
      setError(err.message || 'Erro ao votar na thread');
    }
  };

  const handleReport = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const tipo = sessionStorage.getItem('tipo');
      const colaborador_id = sessionStorage.getItem('colaboradorid');

      if (!token) {
        throw new Error('Utilizador não autenticado');
      }

      if (tipo !== 'Formando') {
        throw new Error('Apenas formandos podem denunciar threads');
      }

      if (!colaborador_id) {
        throw new Error('ID do colaborador não encontrado');
      }

      const formandoResponse = await axios.get(`/formando/colaborador/${colaborador_id}`);
      if (!formandoResponse.data || !formandoResponse.data.formando_id) {
        throw new Error('Formando não encontrado');
      }

      const reportData = {
        thread_id: parseInt(threadId),
        formando_id: formandoResponse.data.formando_id,
        descricao: 'Denúncia de conteúdo inapropriado'
      };

      await axios.post('/denuncia/criar', reportData);
      alert('Denúncia enviada com sucesso');
    } catch (err) {
      console.error('Erro ao denunciar:', err);
      setError(err.message || 'Erro ao enviar denúncia');
    }
  };

  const handleCommentSubmit = async (e, replyToId = null) => {
    e.preventDefault();
    try {
      const colaborador_id = sessionStorage.getItem('colaboradorid');
      if (!colaborador_id) {
        throw new Error('Utilizador não autenticado');
      }

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

      // Atualizar lista de comentários
      const commentsResponse = await axios.get(`/comentario/thread/${threadId}`);
      setComments(commentsResponse.data);
    } catch (err) {
      console.error('Erro ao comentar:', err);
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
    console.log('Renderizando comentário:', comment);
    return (
      <div key={comment.comentario_id} className="comment">
        <div className="comment-header">
          <span className="comment-author">{comment.colab_comentarios.nome}</span>
          {comment.colab_comentarios.cargo && (
            <span className="comment-role">{comment.colab_comentarios.cargo}</span>
          )}
        </div>
        <div className="comment-content">{comment.descricao}</div>
        <div className="comment-actions">
          <button onClick={() => handleReply(comment.comentario_id)} className="reply-btn">
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

  return (
    <div className="thread-detail-container">
      <div className="thread-header">
        <h1>{thread.titulo}</h1>
        <button onClick={() => navigate(`/forum/${id}`)} className="back-btn">
          Voltar ao Fórum
        </button>
      </div>

      <div className="thread-content">
        <div className="thread-info">
          <div className="author-info">
            <span>Autor: {thread.user?.nome || 'Anônimo'}</span>
            {thread.user?.cargo && <span>Cargo: {thread.user.cargo}</span>}
            {thread.user?.departamento && <span>Departamento: {thread.user.departamento}</span>}
          </div>
          <div className="thread-description">
            <p>{thread.descricao}</p>
          </div>
        </div>

        <div className="thread-actions">
          <div className="vote-section">
            <button
              onClick={() => handleVote(1)}
              className={`vote-btn ${voteStatus === 1 ? 'voted' : ''}`}
              title="Upvote"
            >
              👍
            </button>
            <span className="vote-count">{thread.voto_count || 0}</span>
            <button
              onClick={() => handleVote(-1)}
              className={`vote-btn ${voteStatus === -1 ? 'voted' : ''}`}
              title="Downvote"
            >
              👎
            </button>
          </div>
          <button onClick={handleReport} className="report-btn">
            Denunciar
          </button>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comentários</h2>
        <form onSubmit={(e) => handleCommentSubmit(e)} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            required
          />
          <div className="comment-form-actions">
            <button type="submit" className="submit-comment-btn">
              Comentar
            </button>
          </div>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadDetail; 