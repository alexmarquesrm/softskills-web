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

const ModalEditarFicheiro = ({ 
  show, 
  handleClose, 
  ficheiro = null,
  onSaveSuccess = null,
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
  const [ficheirosCarregados, setFicheirosCarregados] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ show: false, message: '', type: '' });

  // Atualiza o formulário quando os dados do ficheiro mudam
  useEffect(() => {
    if (ficheiro) {
      setFormData({
        titulo: ficheiro.titulo || '',
        descricao: ficheiro.descricao || '',
        dataentrega: ficheiro.dataEntrega || ''
      });
      
      if (ficheiro.tipo) {
        setTipoFicheiro(ficheiro.tipo);
      }
      
      if (ficheiro.ficheiros && Array.isArray(ficheiro.ficheiros)) {
        setFicheirosCarregados(ficheiro.ficheiros);
      }
    }
  }, [ficheiro]);

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

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.titulo || ficheirosCarregados.length === 0) {
      setFeedbackMsg({
        show: true,
        message: 'Por favor, preencha o título e carregue pelo menos um arquivo.',
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
      
      // Simula um atraso para demonstrar o estado de "uploading"
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dadosAtualizados = {
        id: ficheiro?.id, // Mantém o ID original
        tipo: tipoFicheiro, // Tipo não muda durante edição
        titulo: formData.titulo,
        descricao: formData.descricao,
        dataEntrega: formData.dataentrega || null,
        ficheiros: ficheirosCarregados,
        cursoId: cursoId || ficheiro?.cursoId,
        moduloId: moduloId || ficheiro?.moduloId,
        // Preservar quaisquer outros campos que o objeto original tinha
        ...(ficheiro ? Object.fromEntries(
          Object.entries(ficheiro).filter(([key]) => 
            !['id', 'tipo', 'titulo', 'descricao', 'dataEntrega', 'ficheiros', 'cursoId', 'moduloId'].includes(key)
          )
        ) : {})
      };

      console.log('Dados a atualizar:', dadosAtualizados);
      
      // Aqui você enviaria os dados para o servidor
      // Exemplo: await api.put(`/ficheiros/${ficheiro.id}`, dadosAtualizados);
      
      if (onSaveSuccess) {
        onSaveSuccess(dadosAtualizados);
      }
      
      setFeedbackMsg({
        show: true,
        message: 'Material atualizado com sucesso!',
        type: 'success'
      });
      
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao atualizar ficheiro:', error);
      setFeedbackMsg({
        show: true,
        message: 'Erro ao atualizar material. Tente novamente.',
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

  // Função para renderizar o campo de data de entrega baseado no tipo de arquivo
  const renderCampoDataEntrega = () => {
    if (configAtual.requerData && allowDueDate) {
      return (
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
      );
    }
    return null;
  };

  // Componente personalizado para exibir instruções específicas por tipo
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

  return (
    <ModalCustom 
      show={show} 
      handleClose={handleClose} 
      title={`Editar ${tipoFicheiro === 'video' ? 'Vídeo' : tipoFicheiro === 'entrega' ? 'Avaliação' : 'Documento'}`}
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
          {/* Display current file type as a badge/indicator */}
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
            
            {renderCampoDataEntrega()}
          </Row>

          <Row className="mb-4">
            <InputField 
              label="Descrição" 
              type="textarea" 
              placeholder={tipoFicheiro === 'entrega' ? 
                "Descreva a avaliação, critérios e instruções para os alunos" : 
                "Descrição do material (opcional)"} 
              name="descricao" 
              value={formData.descricao || ''} 
              onChange={handleChange} 
              colSize={12} 
              rows={3} 
              style={{ resize: 'none' }}
            />
          </Row>

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
                <p className="mb-1 text-muted small">{ficheirosCarregados.length > 0 ? "Os arquivos existentes serão mantidos a menos que você os remova" : "Nenhum arquivo atualmente"}</p>
                <p className="mb-1 small text-muted">
                  Tipos permitidos: {extensoesAceitas}
                </p>
                <p className="small text-muted">
                  Tamanho máximo: {configAtual.maxSize / (1024 * 1024)}MB
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
                uploading ? "A guardar..." : 
                ficheirosCarregados.length > 0 ? "Guardar Alterações" : "Selecione um arquivo"
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

export default ModalEditarFicheiro;