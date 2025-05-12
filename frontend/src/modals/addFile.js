import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Badge, Card, Alert, ListGroup, Button } from 'react-bootstrap';
import InputField from '../components/textFields/basic';
import ModalCustom from './modalCustom';
import Cancelar from '../components/buttons/cancelButton';
import Guardar from '../components/buttons/saveButton';
import { BsArrowReturnLeft, BsExclamationCircle, BsCheckCircle, BsInfoCircle } from 'react-icons/bs';
import { IoCalendarNumberSharp } from "react-icons/io5";
import { useDropzone } from 'react-dropzone';
import { FaRegSave, FaTrashAlt } from "react-icons/fa";
import { FiFile, FiVideo, FiFileText, FiUploadCloud } from 'react-icons/fi';
import axios from "../config/configAxios";

const ModalAdicionarFicheiro = ({ 
  show, 
  handleClose, 
  tiposPermitidos = ['documento', 'video', 'entrega'],
  tipoInicial = 'documento',
  onUploadSuccess = null,
  courseId = null,
  moduloId = null,
  allowDueDate = true
}) => {
  const [formData, setFormData] = useState({});
  const [tipoFicheiro, setTipoFicheiro] = useState(tipoInicial);
  const [ficheirosCarregados, setFicheirosCarregados] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ show: false, message: '', type: '' });

  // Redefine o tipo de ficheiro quando os tipos permitidos mudam
  useEffect(() => {
    if (!tiposPermitidos.includes(tipoFicheiro) && tiposPermitidos.length > 0) {
      setTipoFicheiro(tiposPermitidos[0]);
    }
  }, [tiposPermitidos, tipoFicheiro]);

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
      accept: {},
      maxSize: 0,
      requerData: true,
      cor: 'warning',
      icon: <FiFile size={24} />,
      descricao: 'Entregas de trabalhos'
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
      requerData: false,
      cor: 'info',
      icon: <FiFile size={24} />,
      descricao: 'Trabalhos para realizar (PDF, DOC, ZIP, etc.)'
    }
  };

  const configAtual = tiposConfig[tipoFicheiro] || tiposConfig.documento;

  const onDrop = (acceptedFiles) => {
    const arquivosValidos = acceptedFiles.filter(
      file => file.size <= configAtual.maxSize
    );
    
    if (arquivosValidos.length > 0) {
      setFicheirosCarregados([...ficheirosCarregados, ...arquivosValidos]);
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: configAtual.accept,
    maxFiles: 5,
    maxSize: configAtual.maxSize
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const removerFicheiro = (index) => {
    const novosFicheiros = [...ficheirosCarregados];
    novosFicheiros.splice(index, 1);
    setFicheirosCarregados(novosFicheiros);
  };

  const limparFormulario = () => {
    setFormData({});
    setFicheirosCarregados([]);
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!courseId) {
      setFeedbackMsg({
        show: true,
        message: 'ID do curso não encontrado.',
        type: 'danger'
      });
      return;
    }

    if (!formData.titulo) {
      setFeedbackMsg({
        show: true,
        message: 'Por favor, preencha o título.',
        type: 'danger'
      });
      return;
    }

    // Validação específica por tipo
    if (tipoFicheiro === 'trabalho' && ficheirosCarregados.length === 0) {
      setFeedbackMsg({
        show: true,
        message: 'Por favor, carregue o arquivo do trabalho.',
        type: 'danger'
      });
      return;
    }

    if (tipoFicheiro === 'entrega' && !formData.dataentrega) {
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
      
      // Preparar os arquivos para upload (apenas se for trabalho)
      let filesData = [];
      if (tipoFicheiro === 'trabalho') {
        const filesPromises = ficheirosCarregados.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
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
        });
        
        filesData = await Promise.all(filesPromises);
      }
      
      // Preparar dados para a API
      const dadosEnvio = {
        titulo: formData.titulo,
        descricao: formData.descricao || '',
        tipo: tipoFicheiro,
        dataEntrega: formData.dataentrega || null,
        ficheiros: filesData
      };
      
      // Enviar para a API
      const response = await axios.post(`/material/curso/${courseId}/materiais`, dadosEnvio, {
        headers: { Authorization: `${token}` }
      });
      
      if (response.data.success) {
        // Se for um trabalho, perguntar se deseja criar a entrega
        if (tipoFicheiro === 'trabalho') {
          const criarEntrega = window.confirm('Deseja criar automaticamente a entrega correspondente a este trabalho?');
          
          if (criarEntrega) {
            const entregaData = {
              titulo: `Entrega: ${formData.titulo}`,
              descricao: formData.descricao || '',
              tipo: 'entrega',
              dataEntrega: formData.dataentrega || null,
              ficheiros: [] // Entrega começa sem arquivos
            };

            try {
              await axios.post(`/material/curso/${courseId}/materiais`, entregaData, {
                headers: { Authorization: `${token}` }
              });
            } catch (error) {
              console.error('Erro ao criar entrega automática:', error);
              // Não interrompe o fluxo se falhar ao criar a entrega
            }
          }
        }

        setFeedbackMsg({
          show: true,
          message: 'Material adicionado com sucesso!',
          type: 'success'
        });
        
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
        
        // Fechar modal após um breve delay
        setTimeout(() => {
          limparFormulario();
          handleClose();
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Erro ao adicionar material');
      }
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      setFeedbackMsg({
        show: true,
        message: error.response?.data?.message || 'Erro ao adicionar material. Tente novamente.',
        type: 'danger'
      });
    } finally {
      setUploading(false);
    }
  };

  // Formata o tamanho do arquivo para exibição
  const formatarTamanho = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Lista de extensões aceitas para exibição amigável
  const extensoesAceitas = Object.values(configAtual.accept).flat().join(', ');

  // Filtra os tipos configurados para mostrar apenas os permitidos
  const tiposConfiguradosPermitidos = Object.entries(tiposConfig)
    .filter(([tipo]) => tiposPermitidos.includes(tipo));

  return (
    <ModalCustom 
      show={show} 
      handleClose={handleClose} 
      title="Adicionar Material" 
      onSubmit={handleSubmit}
      size="lg"
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
          {/* Seleção de tipo de arquivo - só mostra se houver mais de um tipo permitido */}
          {tiposPermitidos.length > 1 && (
            <div className="mb-4">
              <Form.Label className="fw-bold mb-2">Tipo de Conteúdo</Form.Label>
              <Row className="g-3">
                {tiposConfiguradosPermitidos.map(([tipo, config]) => (
                  <Col xs={12} md={4} key={tipo}>
                    <Card 
                      onClick={() => setTipoFicheiro(tipo)}
                      className={`h-100 ${tipoFicheiro === tipo ? 'border-' + config.cor : ''}`}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: tipoFicheiro === tipo ? `rgba(var(--bs-${config.cor}-rgb), 0.1)` : '',
                        transform: tipoFicheiro === tipo ? 'translateY(-3px)' : '',
                        transition: 'all 0.2s ease',
                        boxShadow: tipoFicheiro === tipo ? '0 5px 10px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Card.Body className="d-flex align-items-center">
                        <div className={`text-${config.cor} me-3`}>{config.icon}</div>
                        <div>
                          <div className="fw-bold">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</div>
                          <div className="small text-muted">{config.descricao}</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

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

          {/* Upload de Arquivos - Mostrar apenas para trabalho */}
          {tipoFicheiro === 'trabalho' && (
            <Row className="mb-4">
              <Col md={12}>
                <Form.Label className="fw-bold mb-2">Upload de Arquivo</Form.Label>
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
                  <p className="mb-1 fw-bold">Arraste e solte ou clique para selecionar</p>
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
                            borderLeft: `3px solid var(--bs-${configAtual.cor})`,
                            borderRadius: '6px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <Badge bg={configAtual.cor} className="me-2 py-2 px-2">
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
                uploading ? "Adicionando..." : 
                ficheirosCarregados.length > 0 ? "Adicionar Material" : "Selecione um arquivo"
              } 
              onClick={handleSubmit} 
              Icon={uploading ? null : FaRegSave} 
              disabled={ficheirosCarregados.length === 0 || !formData.titulo || uploading}
              loading={uploading}
            />
          </div>
        </Card.Body>
      </Card>
    </ModalCustom>
  );
};

export default ModalAdicionarFicheiro;