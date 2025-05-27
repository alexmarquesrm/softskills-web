import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Badge, Card, Alert, ListGroup, Button, Spinner, Modal } from 'react-bootstrap';
import InputField from '../../components/textFields/basic';
import ModalCustom from '../modalCustom';
import Cancelar from '../../components/buttons/cancelButton';
import Guardar from '../../components/buttons/saveButton';
import { BsArrowReturnLeft, BsExclamationCircle, BsCheckCircle, BsInfoCircle } from 'react-icons/bs';
import { useDropzone } from 'react-dropzone';
import { FaRegSave, FaTrashAlt } from "react-icons/fa";
import { FiFile, FiUploadCloud } from 'react-icons/fi';
import axios from '../../config/configAxios';
import { toast } from 'react-toastify';

const ModalSubmeterTrabalho = ({ 
  show, 
  handleClose, 
  avaliacao = null,
  onSubmitSuccess = null,
  cursoId = null,
  moduloId = null
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    comentario: '',
  });
  const [ficheirosCarregados, setFicheirosCarregados] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ show: false, message: '', type: '' });
  const [prazoExpirado, setPrazoExpirado] = useState(false);
  const [submissaoExistente, setSubmissaoExistente] = useState(null);
  const [loadingSubmissao, setLoadingSubmissao] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Função para buscar submissão existente
  const buscarSubmissaoExistente = async () => {
    if (!avaliacao?.id || !cursoId) return;

    try {
      setLoadingSubmissao(true);
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`/trabalhos/avaliacao/${avaliacao.id}/curso/${cursoId}`, {
        headers: { Authorization: `${token}` }
      });

      if (response.data.success && response.data.data) {
        setSubmissaoExistente(response.data.data);
        // Preencher o formulário com os dados da submissão existente
        setFormData({
          titulo: response.data.data.titulo || '',
          comentario: response.data.data.comentario || ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar submissão existente:', error);
    } finally {
      setLoadingSubmissao(false);
    }
  };

  // Função para limpar o estado do modal
  const limparEstado = () => {
    setFormData({
      titulo: '',
      comentario: '',
    });
    setFicheirosCarregados([]);
    setUploading(false);
    setFeedbackMsg({ show: false, message: '', type: '' });
    setSubmissaoExistente(null);
    setPrazoExpirado(false);
    setLoadingSubmissao(false);
  };

  // Função para fechar o modal e limpar o estado
  const handleCloseModal = () => {
    limparEstado();
    handleClose();
  };

  // Atualiza o formulário quando os dados da avaliação mudam
  useEffect(() => {
    if (show) {
      limparEstado();
    }
    
    if (avaliacao) {
      setFormData({
        titulo: `Entrega: ${avaliacao.titulo || ''}`,
        comentario: ''
      });

      // Verificar se o prazo já expirou
      if (avaliacao.dataEntrega) {
        const dataEntrega = new Date(avaliacao.dataEntrega);
        const agora = new Date();
        setPrazoExpirado(dataEntrega < agora);
      }

      // Buscar submissão existente
      buscarSubmissaoExistente();
    }
  }, [avaliacao, cursoId, show]);

  // Configuração para submissão de trabalhos
  const configSubmissao = {
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    cor: 'success',
    icon: <FiFile size={24} />,
    descricao: 'Submissão de trabalhos (PDF, DOC, ZIP, RAR, etc.)'
  };

  const onDrop = (acceptedFiles) => {
    if (prazoExpirado) {
      setFeedbackMsg({
        show: true,
        message: 'O prazo para submissão já expirou.',
        type: 'danger'
      });
      return;
    }

    const arquivosValidos = acceptedFiles.filter(
      file => file.size <= configSubmissao.maxSize
    );
    
    if (arquivosValidos.length > 0) {
      // Permitir apenas um ficheiro por submissão
      setFicheirosCarregados([arquivosValidos[0]]);
      setFeedbackMsg({
        show: true,
        message: 'Arquivo selecionado com sucesso!',
        type: 'success'
      });
      setTimeout(() => {
        setFeedbackMsg({ show: false, message: '', type: '' });
      }, 3000);
    }
    
    if (arquivosValidos.length !== acceptedFiles.length) {
      setFeedbackMsg({
        show: true,
        message: `Alguns arquivos excedem o tamanho máximo de ${configSubmissao.maxSize / (1024 * 1024)}MB e foram ignorados.`,
        type: 'warning'
      });
      setTimeout(() => {
        setFeedbackMsg({ show: false, message: '', type: '' });
      }, 5000);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: configSubmissao.accept,
    maxFiles: 1,
    maxSize: configSubmissao.maxSize,
    disabled: prazoExpirado
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const removerFicheiro = (index) => {
    const novosFicheiros = [...ficheirosCarregados];
    novosFicheiros.splice(index, 1);
    setFicheirosCarregados(novosFicheiros);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Iniciando submissão com dados:', {
      avaliacao,
      cursoId,
      formData,
      ficheirosCarregados: ficheirosCarregados.length
    });

    // Verificar se temos todos os dados necessários
    if (!avaliacao || !cursoId) {
      console.error('Dados inválidos:', {
        avaliacao: avaliacao,
        cursoId: cursoId
      });
      toast.error("Dados do curso ou avaliação inválidos");
      return;
    }

    // Verificar se o ID da avaliação está presente
    if (!avaliacao.id) {
      console.error('ID da avaliação não encontrado:', avaliacao);
      toast.error("ID da avaliação não encontrado");
      return;
    }

    if (prazoExpirado) {
      console.log('Prazo expirado para submissão');
      toast.error("O prazo para submissão já expirou");
      return;
    }

    if (!formData.titulo.trim()) {
      console.log('Título não fornecido');
      toast.error("Por favor, insira um título para a submissão");
      return;
    }

    if (ficheirosCarregados.length === 0) {
      console.log('Nenhum arquivo carregado');
      toast.error("Por favor, faça upload de pelo menos um ficheiro");
      return;
    }

    try {
      setUploading(true);
      const token = sessionStorage.getItem('token');
      console.log('Token obtido:', token ? 'Token presente' : 'Token ausente');

      // Converter ficheiros para base64
      console.log('Iniciando conversão dos arquivos para base64');
      const filePromises = ficheirosCarregados.map(async (file) => {
        try {
          console.log('Processando arquivo:', {
            nome: file.name,
            tipo: file.type,
            tamanho: file.size
          });
          const base64 = await convertToBase64(file);
          return {
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            base64: base64
          };
        } catch (error) {
          console.error("Erro ao converter ficheiro:", {
            nome: file.name,
            erro: error.message
          });
          throw new Error(`Erro ao processar o ficheiro ${file.name}`);
        }
      });

      const processedFiles = await Promise.all(filePromises);
      console.log('Arquivos processados:', {
        quantidade: processedFiles.length,
        detalhes: processedFiles.map(f => ({
          nome: f.nome,
          tipo: f.tipo,
          tamanho: f.tamanho
        }))
      });

      const dadosSubmissao = {
        titulo: formData.titulo,
        comentario: formData.comentario,
        ficheiros: processedFiles,
        curso_id: cursoId,
        avaliacao_id: avaliacao.id,
        data_submissao: new Date().toISOString()
      };

      console.log('Dados da submissão preparados:', {
        titulo: dadosSubmissao.titulo,
        curso_id: dadosSubmissao.curso_id,
        avaliacao_id: dadosSubmissao.avaliacao_id,
        quantidade_ficheiros: dadosSubmissao.ficheiros.length
      });

      console.log('Enviando requisição para:', '/trabalhos/submeter');
      const response = await axios.post('/trabalhos/submeter', dadosSubmissao, {
        headers: { 
          Authorization: `${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta do servidor:', response.data);

      if (response.data.success) {
        console.log('Submissão realizada com sucesso');
        toast.success("Ficheiro submetido com sucesso!");
        
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data.data);
        }
        
        handleCloseModal();
      } else {
        console.error('Erro na resposta do servidor:', response.data);
        throw new Error(response.data.message || "Erro ao submeter ficheiro");
      }
    } catch (error) {
      console.error("Erro detalhado ao submeter ficheiro:", {
        mensagem: error.message,
        resposta: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.message || "Erro ao submeter ficheiro. Por favor, tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          console.log('Arquivo convertido com sucesso:', file.name);
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } catch (error) {
          console.error('Erro ao processar base64:', {
            arquivo: file.name,
            erro: error.message
          });
          reject(new Error("Erro ao processar o ficheiro"));
        }
      };
      reader.onerror = (error) => {
        console.error('Erro ao ler arquivo:', {
          arquivo: file.name,
          erro: error
        });
        reject(new Error("Erro ao ler o ficheiro"));
      };
      reader.readAsDataURL(file);
    });
  };

  // Formata o tamanho do arquivo para exibição
  const formatarTamanho = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const extensoesAceitas = Object.values(configSubmissao.accept).flat().join(', ');

  // Informações sobre a avaliação
  const renderInfoAvaliacao = () => {
    if (!avaliacao) return null;
    
    return (
      <Card className="mb-4 bg-light border-0">
        <Card.Body>
          <h6 className="fw-bold">Detalhes da Avaliação:</h6>
          <Row className="mt-3">
            <Col md={12}>
              <p className="mb-1"><strong>Título:</strong> {avaliacao.titulo}</p>
              {avaliacao.dataEntrega && (
                <p className="mb-1">
                  <strong>Data de Entrega:</strong> {
                    new Date(avaliacao.dataEntrega).toLocaleString('pt-PT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  }
                  {prazoExpirado && (
                    <Badge bg="danger" className="ms-2">
                      Prazo Expirado
                    </Badge>
                  )}
                </p>
              )}
              {avaliacao.descricao && (
                <div className="mt-2">
                  <strong>Descrição:</strong>
                  <p className="mt-1">{avaliacao.descricao}</p>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const handleSubstituirClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!submissaoExistente?.trabalho_id) return;
    setDeleting(true);
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`/trabalhos/${submissaoExistente.trabalho_id}`, {
        headers: { Authorization: `${token}` }
      });
      setShowConfirmDelete(false);
      setSubmissaoExistente(null);
      limparEstado();
      toast.success('Submissão removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover submissão.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ModalCustom 
      show={show} 
      handleClose={handleCloseModal} 
      title="Submeter Trabalho"
      size="lg"
      className="submeter-trabalho-modal"
    >
      {/* Feedback message */}
      {feedbackMsg.show && (
        <Alert variant={feedbackMsg.type} className="d-flex align-items-center mb-4">
          {feedbackMsg.type === "success" ? (
            <BsCheckCircle className="me-2" />
          ) : feedbackMsg.type === "warning" ? (
            <BsExclamationCircle className="me-2" />
          ) : (
            <BsInfoCircle className="me-2" />
          )}
          {feedbackMsg.message}
        </Alert>
      )}
      
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {/* Informações da avaliação */}
          {renderInfoAvaliacao()}

          {/* Mostrar submissão existente se houver */}
          {loadingSubmissao ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">A carregar submissão...</p>
            </div>
          ) : submissaoExistente ? (
            <>
              <Alert variant="info" className="mb-4">
                <div className="d-flex align-items-center">
                  <BsInfoCircle className="me-2" size={24} />
                  <div>
                    <h6 className="mb-2">Submissão já realizada</h6>
                    <p className="mb-1"><strong>Título:</strong> {submissaoExistente.titulo}</p>
                    <p className="mb-1"><strong>Data de submissão:</strong> {new Date(submissaoExistente.data_submissao).toLocaleString('pt-PT')}</p>
                    {submissaoExistente.comentario && (
                      <p className="mb-1"><strong>Comentário:</strong> {submissaoExistente.comentario}</p>
                    )}
                    {submissaoExistente.ficheiros && submissaoExistente.ficheiros.length > 0 && (
                      <div className="mt-2">
                        <strong>Arquivos submetidos:</strong>
                        <ListGroup className="mt-2">
                          {submissaoExistente.ficheiros.map((file, index) => (
                            <ListGroup.Item key={index} className="d-flex align-items-center">
                              <Badge bg="primary" className="me-2">
                                {file.nome.split('.').pop().toUpperCase()}
                              </Badge>
                              <span>{file.nome}</span>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
              <div className="d-flex justify-content-end">
                <Button
                  variant="warning"
                  onClick={handleSubstituirClick}
                >
                  Substituir Submissão
                </Button>
              </div>
              <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Substituição</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Tem a certeza que deseja remover a submissão anterior e enviar uma nova? Esta ação não pode ser desfeita.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowConfirmDelete(false)} disabled={deleting}>
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>
                    {deleting ? 'A remover...' : 'Remover e Substituir'}
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : (
            <>
              {/* Tipo de submissão*/}
              <div className="mb-4">
                <Row>
                  <Col>
                    <div className="d-flex align-items-center">
                      <div className={`text-${configSubmissao.cor} me-2`}>
                        {configSubmissao.icon}
                      </div>
                      <div>
                        <Badge bg={configSubmissao.cor} className="px-3 py-2">
                          Submissão de Trabalho
                        </Badge>
                        <span className="ms-2 text-muted small">{configSubmissao.descricao}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {!prazoExpirado && (
                <>
                  <Alert variant="info" className="mt-3 mb-4">
                    <BsInfoCircle className="me-2" />
                    <strong>Importante:</strong> Certifique-se de que todos os documentos necessários estão incluídos antes de submeter.
                    Uma vez submetido, não será possível editar o seu trabalho.
                  </Alert>

                  <Row className="mb-4">
                    <InputField label="Título da Submissão" type="text" placeholder="Ex: Entrega Trabalho Final" name="titulo" value={formData.titulo} onChange={handleChange} colSize={12}/>
                  </Row>

                  <Row className="mb-4">
                    <InputField label="Comentários (opcional)" type="textarea" placeholder="Adicione comentários ou observações sobre a sua submissão" name="comentario" value={formData.comentario} onChange={handleChange} colSize={12} rows={3} style={{ resize: 'none' }} />
                  </Row>

                  <Row className="mb-4">
                    <Col md={12}>
                      <Form.Label className="fw-bold mb-2">Upload de Arquivos</Form.Label>
                      <div 
                        {...getRootProps()} 
                        className={`text-center p-4 rounded ${isDragActive ? 'bg-light' : 'bg-light'}`}
                        style={{
                          border: `2px dashed ${isDragActive ? '#28a745' : '#39639C'}`,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                      >
                        <input {...getInputProps()} />
                        <FiUploadCloud size={36} className="text-success mb-2" />
                        <p className="mb-1 fw-bold">Arraste e solte ou clique para selecionar um arquivo</p>
                        <p className="mb-1 text-muted small">
                          {ficheirosCarregados.length > 0 
                            ? `${ficheirosCarregados.length} arquivo selecionado` 
                            : "Nenhum arquivo selecionado"}
                        </p>
                        <p className="mb-1 small text-muted">
                          Tipos permitidos: {extensoesAceitas}
                        </p>
                        <p className="small text-muted">
                          Tamanho máximo: {configSubmissao.maxSize / (1024 * 1024)}MB
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {/* Lista de arquivos carregados */}
                  {ficheirosCarregados.length > 0 && (
                    <Row className="mb-4">
                      <Col md={12}>
                        <Card className="bg-light border-0">
                          <Card.Body>
                            <h6 className="fw-bold mb-3">Arquivos Selecionados:</h6>
                            <ListGroup>
                              {ficheirosCarregados.map((file, index) => (
                                <ListGroup.Item
                                  key={index}
                                  className="d-flex justify-content-between align-items-center mb-2 bg-white"
                                  style={{ 
                                    borderLeft: `3px solid var(--bs-${configSubmissao.cor})`,
                                    borderRadius: '6px',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <div className="d-flex align-items-center">
                                    <Badge bg={configSubmissao.cor} className="me-2 py-2 px-2">
                                      {file.name.split('.').pop().toUpperCase()}
                                    </Badge>
                                    <div>
                                      <div>{file.name}</div>
                                      <small className="text-muted">
                                        {formatarTamanho(file.size)}
                                      </small>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    onClick={() => removerFicheiro(index)}
                                  >
                                    <FaTrashAlt size={14} />
                                  </Button>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  )}

                  <div className="d-flex justify-content-center mt-4">
                    <Cancelar text="Cancelar" onClick={handleCloseModal} Icon={BsArrowReturnLeft} inline={true} className="me-2" disabled={uploading} />
                    <Guardar text={uploading ? "A submeter..." : ficheirosCarregados.length > 0 ? "Submeter Trabalho" : "Selecione um arquivo" } onClick={handleSubmit} Icon={uploading ? null : FaRegSave} disabled={ficheirosCarregados.length === 0 || !formData.titulo || uploading} loading={uploading} />
                  </div>
                </>
              )}

              {prazoExpirado && (
                <Alert variant="danger" className="mt-4">
                  <BsExclamationCircle className="me-2" />
                  <strong>Atenção:</strong> O prazo para submissão deste trabalho já expirou. Entre em contato com o formador para mais informações.
                </Alert>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </ModalCustom>
  );
};

export default ModalSubmeterTrabalho;