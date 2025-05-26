import React, { useState, useEffect } from 'react';
import axios from "../../config/configAxios";
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, ThumbsUp, ThumbsDown, Flag, Send, User, Image, X, Paperclip } from 'react-feather';
import { Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [threadResponse, commentsResponse] = await Promise.all([
          axios.get(`/thread/${threadId}`),
          axios.get(`/comentario/thread/${threadId}`)
        ]);
        setThread(threadResponse.data);
        setComments(commentsResponse.data);
        // procurar info do fórum para mostrar nome
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
      toast.success('Denúncia enviada com sucesso');
    } catch (err) {
      setError(err.message || 'Erro ao enviar denúncia');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      // Se já existe uma imagem, remover antes de adicionar a nova
      if (selectedImage) {
        handleRemoveImage();
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleReplyImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      // Se já existe uma imagem, remover antes de adicionar a nova
      if (replyImage) {
        handleRemoveReplyImage();
      }

      setReplyImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReplyImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReplyImage = () => {
    setReplyImage(null);
    setReplyImagePreview(null);
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    setReplyComment('');
    setReplyImage(null);
    setReplyImagePreview(null);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyComment('');
    setReplyImage(null);
    setReplyImagePreview(null);
  };

  const handleCommentSubmit = async (e, replyToId = null) => {
    e.preventDefault();
    try {
      const commentText = replyToId ? replyComment : newComment;
      const imageToUpload = replyToId ? replyImage : selectedImage;

      if (!commentText || commentText.trim().length === 0) {
        toast.error('O comentário não pode estar vazio');
        return;
      }

      const colaborador_id = sessionStorage.getItem('colaboradorid');
      if (!colaborador_id) throw new Error('Utilizador não autenticado');

      let imagem = null;
      if (imageToUpload) {
        let base64 = imageToUpload;
        if (typeof imageToUpload !== 'string') {
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(imageToUpload);
          });
        }
        imagem = {
          nome: imageToUpload.name,
          base64,
          tamanho: imageToUpload.size
        };
      }

      const payload = {
        thread_id: threadId,
        colaborador_id,
        descricao: commentText,
        ...(replyToId || replyTo ? { comentariopai_id: replyToId || replyTo } : {}),
        ...(imagem ? { imagem } : {})
      };

      await axios.post('/comentario/criar', payload);

      setNewComment('');
      setReplyComment('');
      setReplyTo(null);
      setSelectedImage(null);
      setImagePreview(null);
      setReplyImage(null);
      setReplyImagePreview(null);

      const commentsResponse = await axios.get(`/comentario/thread/${threadId}`);
      setComments(commentsResponse.data);
      toast.success('Comentário adicionado com sucesso!');
    } catch (err) {
      toast.error(err.message || 'Erro ao adicionar comentário');
    }
  };

  const renderComment = (comment) => {
    return (
      <div key={comment.comentario_id} className="comment-card">
        <div className="comment-card-header">
          <div className="comment-author">
            <span className="author-label">Autor:</span>
            <span className="author-value">{comment.colab_comentarios?.nome || comment.autor_nome || 'Anônimo'}</span>
          </div>
          {comment.colab_comentarios?.colab_funcao && (
            <div className="comment-role">
              <span className="role-label">Função:</span>
              <span className="role-value">{comment.colab_comentarios.colab_funcao.nome}</span>
              {comment.colab_comentarios.colab_funcao.funcao_departamento && (
                <span className="department-value">
                  ({comment.colab_comentarios.colab_funcao.funcao_departamento.nome})
                </span>
              )}
            </div>
          )}
        </div>
        <div className="comment-card-body">
          <p className="comment-content">{comment.descricao}</p>
          {(comment.imagem_url || (comment.imagem && typeof comment.imagem === 'string')) && (
            <div className="comment-image">
              <img src={comment.imagem_url || comment.imagem} alt="Anexo do comentário" />
            </div>
          )}
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
              <div className="reply-buttons">
                <div className="button-group">
                  <input
                    type="file"
                    id={`image-upload-reply-${comment.comentario_id}`}
                    accept="image/*"
                    onChange={handleReplyImageSelect}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`image-upload-reply-${comment.comentario_id}`} className="clip-btn">
                    <Paperclip size={16} />
                  </label>
                  {replyImagePreview && (
                    <div className="image-preview">
                      <img src={replyImagePreview} alt="Preview" />
                      <button onClick={handleRemoveReplyImage} className="remove-image-btn">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={handleCancelReply} className="cancel-reply-btn">
                  Cancelar
                </button>
                <button onClick={(e) => handleCommentSubmit(e, comment.comentario_id)} className="submit-reply-btn">
                  <Send size={16} />
                  Enviar Resposta
                </button>
              </div>
            </div>
          </div>
        )}
        {Array.isArray(comment.respostas) && comment.respostas.length > 0 && (
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
              <div className="forum-header-icon" style={{background: 'linear-gradient(135deg, #416699, #3b96d3)', color: 'white', width: 48, height: 48, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(97, 87, 255, 0.15)'}}>
                <MessageSquare size={28} />
              </div>
            </div>
            <div className="thread-header-info">
              <div className="thread-header-meta">
                {forum && <span className="forum-name">{forum.descricao}</span>}
                <span className="author-name">
                  {thread.user?.fotoPerfilUrl ? (
                    <img
                      src={thread.user.fotoPerfilUrl}
                      alt={thread.user.nome}
                      className="author-avatar-img"
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #d0d8e8', marginRight: 6, verticalAlign: 'middle' }}
                      onError={e => { e.target.src = '/default-profile.png'; }}
                    />
                  ) : null}
                  {thread.user?.nome || 'Anônimo'}
                </span>
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
                  <span className="vote-count positive-votes">{Number(thread.votos_positivos) || 0}</span>
                  <button
                    onClick={() => handleVote(-1)}
                    className={`vote-btn ${voteStatus === -1 ? 'voted' : ''}`}
                    title="Downvote"
                  >
                    <ThumbsDown size={16} />
                  </button>
                  <span className="vote-count negative-votes">{Number(thread.votos_negativos) || 0}</span>
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
              <div className="comment-form-actions">
                <div className="comment-buttons">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="clip-btn">
                    <Paperclip size={16} />
                  </label>
                  <button onClick={(e) => handleCommentSubmit(e)} className="submit-comment-btn">
                    <Send size={16} />
                    Comentar
                  </button>
                </div>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button onClick={handleRemoveImage} className="remove-image-btn">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
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