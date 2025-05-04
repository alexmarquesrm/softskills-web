import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Badge, Card, Alert, ListGroup, Button } from 'react-bootstrap';
import InputField from '../../components/textFields/basic';
import ModalCustom from '../modalCustom';
import Cancelar from '../../components/buttons/cancelButton';
import Guardar from '../../components/buttons/saveButton';
import { BsArrowReturnLeft, BsExclamationCircle, BsCheckCircle, BsInfoCircle } from 'react-icons/bs';
import { useDropzone } from 'react-dropzone';
import { FaRegSave, FaTrashAlt } from "react-icons/fa";
import { FiFile, FiUploadCloud } from 'react-icons/fi';

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

  // Atualiza o formulário quando os dados da avaliação mudam
  useEffect(() => {
    if (avaliacao) {
      setFormData({
        titulo: `Entrega: ${avaliacao.titulo || ''}`,
        comentario: ''
      });
    }
  }, [avaliacao]);

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
    const arquivosValidos = acceptedFiles.filter(
      file => file.size <= configSubmissao.maxSize
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
    maxFiles: 5,
    maxSize: configSubmissao.maxSize
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

  const handleSubmit = async () => {

    if (!formData.titulo || ficheirosCarregados.length === 0) {
      setFeedbackMsg({
        show: true,
        message: 'Por favor, preencha o título e carregue pelo menos um arquivo.',
        type: 'danger'
      });
      return;
    }

    try {
      setUploading(true);
      
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dadosSubmissao = {
        titulo: formData.titulo,
        comentario: formData.comentario,
        ficheiros: ficheirosCarregados,
        cursoId: cursoId,
        moduloId: moduloId,
        avaliacaoId: avaliacao?.id,
        dataSubmissao: new Date().toISOString(),
        estado: 'submetido'
      };

      // Aqui  enviaremos os dados para o servidor
      // Exemplo: await api.post(`/submissoes`, dadosSubmissao);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(dadosSubmissao);
      }
      
      setFeedbackMsg({
        show: true,
        message: 'Trabalho submetido com sucesso!',
        type: 'success'
      });
      
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao submeter trabalho:', error);
      setFeedbackMsg({
        show: true,
        message: 'Erro ao submeter trabalho. Tente novamente.',
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

  return (
    <ModalCustom 
      show={show} 
      handleClose={handleClose} 
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
                <p className="mb-1 fw-bold">Arraste e solte ou clique para selecionar arquivos</p>
                <p className="mb-1 text-muted small">
                  {ficheirosCarregados.length > 0 
                    ? `${ficheirosCarregados.length} arquivo(s) selecionado(s)` 
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
            <Cancelar text="Cancelar" onClick={handleClose} Icon={BsArrowReturnLeft} inline={true} className="me-2" disabled={uploading} />
            <Guardar text={uploading ? "A submeter..." : ficheirosCarregados.length > 0 ? "Submeter Trabalho" : "Selecione um arquivo" } onClick={handleSubmit} Icon={uploading ? null : FaRegSave} disabled={ficheirosCarregados.length === 0 || !formData.titulo || uploading} loading={uploading} />
          </div>
        </Card.Body>
      </Card>
    </ModalCustom>
  );
};

export default ModalSubmeterTrabalho;