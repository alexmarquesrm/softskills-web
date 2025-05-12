import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Badge, Card, Alert, ListGroup, Button } from 'react-bootstrap';
import InputField from '../components/textFields/basic';
import ModalCustom from './modalCustom';
import Cancelar from '../components/buttons/cancelButton';
import Guardar from '../components/buttons/saveButton';
import { BsArrowReturnLeft, BsExclamationCircle, BsCheckCircle, BsInfoCircle, BsDownload } from 'react-icons/bs';
import { IoCalendarNumberSharp } from "react-icons/io5";
import { useDropzone } from 'react-dropzone';
import { FaRegSave, FaTrashAlt } from "react-icons/fa";
import { FiFile, FiVideo, FiFileText, FiUploadCloud, FiEye, FiDownload } from 'react-icons/fi';
import axios from "../config/configAxios";

const ModalEditarFicheiro = ({ 
  show, 
  handleClose, 
  fileId,
  onUpdateSuccess = null,
  cursoId = null,
  moduloId = null,
  allowDueDate = true
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataentrega: '',
  });
  const [tipoFicheiro, setTipoFicheiro] = useState('documento');
  const [ficheirosExistentes, setFicheirosExistentes] = useState([]);
  const [ficheirosNovos, setFicheirosNovos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ show: false, message: '', type: '' });

  // Buscar dados do material ao abrir o modal
  useEffect(() => {
    const fetchMaterialData = async () => {
      if (!fileId || !show) return;
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`/material/curso/${fileId}`, {
          headers: { Authorization: `${token}` }
        });
        if (response.data) {
          const materialData = response.data;
          setFormData({
            titulo: materialData.titulo || '',
            descricao: materialData.descricao || '',
            dataentrega: materialData.data_entrega || ''
          });
          
          setTipoFicheiro(materialData.tipo || 'documento');
          
          // Configurar arquivos existentes
          if (materialData.ficheiros && Array.isArray(materialData.ficheiros)) {
            setFicheirosExistentes(materialData.ficheiros);
          }
        } else {
          setFeedbackMsg({
            show: true,
            message: 'Não foi possível carregar os dados do material.',
            type: 'danger'
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do material:', error);
        setFeedbackMsg({
          show: true,
          message: 'Erro ao carregar dados do material.',
          type: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMaterialData();
  }, [fileId, show]);

  // Definição de configurações por tipo de arquivo
  const tiposConfig = {
    documento: {
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'text/plain': ['.txt']
      },
      maxSize: 10 * 1024 * 1024, // 10MB
      requerData: false,
      cor: 'primary',
      icon: <FiFileText size={24} />,
      descricao: 'Documentos (PDF, DOC, DOCX, PPT, XLS, etc.)'
    },
    video: {
      accept: {
        'video/mp4': ['.mp4'],
        'video/webm': ['.webm'],
        'video/avi': ['.avi'],
        'video/quicktime': ['.mov'],
        'video/x-ms-wmv': ['.wmv']
      },
      maxSize: 500 * 1024 * 1024, // 500MB
      requerData: false,
      cor: 'danger',
      icon: <FiVideo size={24} />,
      descricao: 'Vídeos (MP4, WEBM, AVI, MOV, etc.)'
    },
    entrega: {
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/zip': ['.zip'],
        'application/x-rar-compressed': ['.rar'],
        'text/plain': ['.txt']
      },
      maxSize: 50 * 1024 * 1024, // 50MB
      requerData: true,
      cor: 'warning',
      icon: <FiFile size={24} />,
      descricao: 'Entregas de trabalhos (PDF, DOC, ZIP, RAR, etc.)'
    },
    trabalho: {
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/zip': ['.zip'],
        'application/x-rar-compressed': ['.rar'],
        'text/plain': ['.txt']
      },
      maxSize: 20 * 1024 * 1024, // 20MB
      requerData: true,
      cor: 'info',
      icon: <FiFile size={24} />,
      descricao: 'Trabalhos para realizar (PDF, DOC, ZIP, etc.)'
    },
    aula: {
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
      },
      maxSize: 20 * 1024 * 1024, // 20MB
      requerData: false,
      cor: 'success',
      icon: <FiFileText size={24} />,
      descricao: 'Materiais de aula (PDF, DOC, PPT, etc.)'
    }
  };

  const configAtual = tiposConfig[tipoFicheiro] || tiposConfig.documento;

  // Handler para quando arquivos são arrastados ou selecionados
  const onDrop = (acceptedFiles) => {
    const arquivosValidos = acceptedFiles.filter(
      file => file.size <= configAtual.maxSize
    );
    
    if (arquivosValidos.length > 0) {
      setFicheirosNovos([...ficheirosNovos, ...arquivosValidos]);
      setFeedbackMsg({
        show: true,
        message: 'Arquivo(s) adicionado(s) com sucesso!',
        type: 'success'
      });
      
      setTimeout(() => {
        setFeedbackMsg({ show: false, message: '', type: '' });
      }, 3000);
    }
    
    if (arquivosValidos.length !== acceptedFiles.length) {
      setFeedbackMsg({
        show: true,
        message: `Alguns arquivos excedem o tamanho máximo de ${configAtual.maxSize / (1024 * 1024)}MB e foram ignorados.`,
        type: 'warning'
      });
      
      setTimeout(() => {
        setFeedbackMsg({ show: false, message: '', type: '' });
      }, 5000);
    }
  };

  // Configuração do dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: configAtual.accept,
    maxFiles: 5,
    maxSize: configAtual.maxSize
  });

  // Gerenciar alterações no formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Remover um arquivo existente
  const removerFicheiroExistente = (index) => {
    const novosFicheiros = [...ficheirosExistentes];
    novosFicheiros.splice(index, 1);
    setFicheirosExistentes(novosFicheiros);
  };

  // Remover um arquivo novo
  const removerFicheiroNovo = (index) => {
    const novosFicheiros = [...ficheirosNovos];
    novosFicheiros.splice(index, 1);
    setFicheirosNovos(novosFicheiros);
  };

  const handleDownloadFile = (ficheiro) => {
    const link = document.createElement('a');
    link.href = ficheiro.url; // A propriedade 'url' deve existir no objeto do ficheiro
    link.download = ficheiro.nome; // Nome sugerido para o ficheiro
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enviar os dados para atualizar o material
  const handleSubmit = async () => {
    // Validação básica
    if (!formData.titulo || (ficheirosExistentes.length === 0 && ficheirosNovos.length === 0)) {
      setFeedbackMsg({
        show: true,
        message: 'Por favor, preencha o título e mantenha ou adicione pelo menos um arquivo.',
        type: 'danger'
      });
      return;
    }

    if (configAtual.requerData && allowDueDate && !formData.dataentrega) {
      setFeedbackMsg({
        show: true,
        message: 'Por favor, defina uma data de entrega.',
        type: 'danger'
      });
      return;
    }

    try {
      setUploading(true);
      const token = sessionStorage.getItem('token');
      
      // Converter arquivos novos para base64
      const arquivosBase64 = await Promise.all(
        ficheirosNovos.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              // Extrair a parte base64 do resultado
              const base64 = reader.result.split(',')[1];
              resolve({
                nome: file.name,
                base64: base64,
                tamanho: file.size
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      
      // Preparar dados para a API
      const dadosAtualizados = {
        titulo: formData.titulo,
        descricao: formData.descricao || '',
        tipo: tipoFicheiro,
        dataEntrega: formData.dataentrega || null,
        ficheirosExistentes: ficheirosExistentes.map(f => f.ficheiro_id),
        ficheirosNovos: arquivosBase64
      };
      
      // Enviar para a API
      const response = await axios.put(`/material/${fileId}`, dadosAtualizados, {
        headers: { Authorization: `${token}` }
      });
      
      if (response.data.success) {
        setFeedbackMsg({
          show: true,
          message: 'Material atualizado com sucesso!',
          type: 'success'
        });
        
        if (onUpdateSuccess) {
          onUpdateSuccess(response.data.data);
        }
        
        // Fechar modal após um breve delay
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar material');
      }
    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      setFeedbackMsg({
        show: true,
        message: error.response?.data?.message || 'Erro ao atualizar material. Tente novamente.',
        type: 'danger'
      });
    } finally {
      setUploading(false);
    }
  };

  // Formatar tamanho de arquivo para exibição
  const formatarTamanho = (bytes) => {
    if (!bytes) return 'Desconhecido';
    
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Lista de extensões aceitas para exibição
  const extensoesAceitas = Object.values(configAtual.accept).flat().join(', ');

  // Renderizar título da modal baseado no tipo
  const getModalTitle = () => {
    switch (tipoFicheiro) {
      case 'video':
        return 'Editar Vídeo';
      case 'entrega':
        return 'Editar Entrega';
      case 'trabalho':
        return 'Editar Trabalho';
      case 'aula':
        return 'Editar Material de Aula';
      default:
        return 'Editar Documento';
    }
  };

  // Renderizar campos específicos baseados no tipo
  const renderCamposEspecificos = () => {
    switch (tipoFicheiro) {
      case 'entrega':
        return (
          <>
            <Row className="mb-4">
              <InputField 
                label="Título" 
                type="text" 
                placeholder="Nome da entrega" 
                name="titulo" 
                value={formData.titulo || ''} 
                onChange={handleChange} 
                colSize={6}
              />
              <InputField 
                label="Data Entrega" 
                type="datetime-local" 
                placeholder="" 
                name="dataentrega" 
                value={formData.dataentrega || ''} 
                onChange={handleChange} 
                icon={<IoCalendarNumberSharp />} 
                colSize={6}
              />
            </Row>
            <Row className="mb-4">
              <InputField 
                label="Descrição" 
                type="textarea" 
                placeholder="Descreva a entrega e seus requisitos" 
                name="descricao" 
                value={formData.descricao || ''} 
                onChange={handleChange} 
                colSize={12} 
                rows={3} 
                style={{ resize: 'none' }}
              />
            </Row>
          </>
        );
      case 'trabalho':
        return (
          <>
            <Row className="mb-4">
              <InputField 
                label="Título" 
                type="text" 
                placeholder="Nome do trabalho" 
                name="titulo" 
                value={formData.titulo || ''} 
                onChange={handleChange} 
                colSize={12}
              />
            </Row>
            <Row className="mb-4">
              <InputField 
                label="Descrição" 
                type="textarea" 
                placeholder="Descreva o trabalho e suas instruções" 
                name="descricao" 
                value={formData.descricao || ''} 
                onChange={handleChange} 
                colSize={12} 
                rows={3} 
                style={{ resize: 'none' }}
              />
            </Row>
          </>
        );
      default:
        return (
          <>
            <Row className="mb-4">
              <InputField 
                label="Título" 
                type="text" 
                placeholder="Nome do material" 
                name="titulo" 
                value={formData.titulo || ''} 
                onChange={handleChange} 
                colSize={configAtual.requerData && allowDueDate ? 6 : 12}
              />
              {configAtual.requerData && allowDueDate && (
                <InputField 
                  label="Data Entrega" 
                  type="datetime-local" 
                  placeholder="" 
                  name="dataentrega" 
                  value={formData.dataentrega || ''} 
                  onChange={handleChange} 
                  icon={<IoCalendarNumberSharp />} 
                  colSize={6}
                />
              )}
            </Row>
            <Row className="mb-4">
              <InputField 
                label="Descrição" 
                type="textarea" 
                placeholder="Descrição do material (opcional)" 
                name="descricao" 
                value={formData.descricao || ''} 
                onChange={handleChange} 
                colSize={12} 
                rows={3} 
                style={{ resize: 'none' }}
              />
            </Row>
          </>
        );
    }
  };

  // Renderizar instruções específicas baseadas no tipo de arquivo
  const renderInstrucoesPorTipo = () => {
    switch (tipoFicheiro) {
      case 'video':
        return (
          <Alert variant="info" className="mt-3 mb-4">
            <BsInfoCircle className="me-2" />
            <strong>Dica:</strong> Para vídeos, recomendamos o formato MP4 para melhor compatibilidade. 
            Vídeos podem ter até 500MB.
          </Alert>
        );
      case 'entrega':
        return (
          <Alert variant="info" className="mt-3 mb-4">
            <BsInfoCircle className="me-2" />
            <strong>Importante:</strong> Para avaliações e entregas, defina uma data de prazo e 
            forneça instruções claras na descrição.
          </Alert>
        );
      default:
        return null;
    }
  };

  // Renderizar tela de carregamento
  if (loading) {
    return (
      <ModalCustom 
        show={show} 
        handleClose={handleClose} 
        title="Carregando material..."
        size="lg"
      >
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando informações do material...</p>
        </div>
      </ModalCustom>
    );
  }

  return (
    <ModalCustom 
      show={show} 
      handleClose={handleClose} 
      title={getModalTitle()}
      onSubmit={handleSubmit}
      size="lg"
      className="editar-ficheiro-modal"
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
          {/* Indicador do tipo de arquivo */}
          <div className="mb-4">
            <Row>
              <Col>
                <div className="d-flex align-items-center">
                  {configAtual.icon && (
                    <div className={`text-${configAtual.cor} me-2`}>
                      {configAtual.icon}
                    </div>
                  )}
                  <div>
                    <Badge bg={configAtual.cor} className="px-3 py-2">
                      {tipoFicheiro.charAt(0).toUpperCase() + tipoFicheiro.slice(1)}
                    </Badge>
                    <span className="ms-2 text-muted small">{configAtual.descricao}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Instruções específicas baseadas no tipo de arquivo */}
          {renderInstrucoesPorTipo()}

          {/* Campos específicos baseados no tipo */}
          {renderCamposEspecificos()}

          {/* Área de upload de novos arquivos */}
          {tipoFicheiro !== 'entrega' && (
            <Row className="mb-4">
              <Col md={12}>
                <Form.Label className="fw-bold mb-2">Upload de Arquivos</Form.Label>
                <div 
                  {...getRootProps()} 
                  className={`text-center p-4 rounded ${isDragActive ? 'bg-light' : 'bg-light'}`}
                  style={{
                    border: `2px dashed ${isDragActive ? '#0d6efd' : '#4a6baf'}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <input {...getInputProps()} />
                  <FiUploadCloud size={36} className="text-primary mb-2" />
                  <p className="mb-1 fw-bold">Arraste e solte ou clique para adicionar novos arquivos</p>
                  <p className="mb-1 text-muted small">
                    {(ficheirosExistentes.length > 0 || ficheirosNovos.length > 0) ? 
                      "Os arquivos existentes serão mantidos a menos que você os remova" : 
                      "Nenhum arquivo atualmente"}
                  </p>
                  <p className="mb-1 small text-muted">
                    Tipos permitidos: {extensoesAceitas}
                  </p>
                  <p className="small text-muted">
                    Tamanho máximo: {configAtual.maxSize / (1024 * 1024)}MB
                  </p>
                </div>
              </Col>
            </Row>
          )}

          {/* Lista de arquivos existentes */}
          {ficheirosExistentes.length > 0 && tipoFicheiro !== 'entrega' && (
            <Row className="mb-4">
              <Col md={12}>
                <Card className="bg-light border-0">
                  <Card.Body>
                    <h6 className="fw-bold mb-3">Arquivos Existentes:</h6>
                    <ListGroup>
                      {ficheirosExistentes.map((ficheiro, index) => (
                        <ListGroup.Item
                          key={index}
                          className="d-flex justify-content-between align-items-center mb-2 bg-white"
                          style={{ 
                            borderLeft: `3px solid var(--bs-${configAtual.cor})`,
                            borderRadius: '6px'
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <Badge bg={configAtual.cor} className="me-2 py-2 px-2">
                              {ficheiro.nome.split('.').pop().toUpperCase()}
                            </Badge>
                            <div>
                              <div>{ficheiro.nome}</div>
                              <small className="text-muted">
                                {formatarTamanho(ficheiro.tamanho)}
                              </small>
                            </div>
                          </div>
                          <div>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="me-2"
                              onClick={() => handleDownloadFile(ficheiro)}
                            >
                              <FiDownload size={14} />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => removerFicheiroExistente(index)}
                            >
                              <FaTrashAlt size={14} />
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Lista de novos arquivos adicionados */}
          {ficheirosNovos.length > 0 && tipoFicheiro !== 'entrega' && (
            <Row className="mb-4">
              <Col md={12}>
                <Card className="bg-light border-0">
                  <Card.Body>
                    <h6 className="fw-bold mb-3">Novos Arquivos Adicionados:</h6>
                    <ListGroup>
                      {ficheirosNovos.map((file, index) => (
                        <ListGroup.Item
                          key={index}
                          className="d-flex justify-content-between align-items-center mb-2 bg-white"
                          style={{ 
                            borderLeft: `3px solid var(--bs-${configAtual.cor})`,
                            borderRadius: '6px'
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <Badge bg={configAtual.cor} className="me-2 py-2 px-2">
                              {file.name.split('.').pop().toUpperCase()}
                            </Badge>
                            <div>
                              <div>{file.name}</div>
                              <small className="text-muted">
                                {formatarTamanho(file.size)} <Badge bg="success" className="ms-2 py-1">Novo</Badge>
                              </small>
                            </div>
                          </div>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => removerFicheiroNovo(index)}
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

          {/* Botões de ação */}
          <div className="d-flex justify-content-center mt-4">
            <Cancelar 
              text="Cancelar" 
              onClick={handleClose} 
              Icon={BsArrowReturnLeft} 
              inline={true} 
              className="me-2"
              disabled={uploading}
            />
            <Guardar 
              text={
                uploading ? "A guardar..." : 
                (ficheirosExistentes.length > 0 || ficheirosNovos.length > 0 || tipoFicheiro === 'entrega') ? 
                "Guardar Alterações" : "Selecione um arquivo"
              } 
              onClick={handleSubmit} 
              Icon={uploading ? null : FaRegSave} 
              disabled={
                !formData.titulo || 
                uploading || 
                (tipoFicheiro !== 'entrega' && ficheirosExistentes.length === 0 && ficheirosNovos.length === 0)
              }
              loading={uploading}
            />
          </div>
        </Card.Body>
      </Card>
    </ModalCustom>
  );
};

export default ModalEditarFicheiro;