import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Badge } from 'react-bootstrap';
import InputField from '../components/textFields/basic';
import DropdownCheckbox from '../components/dropdown/dropdown';
import ModalCustom from './modalCustom';
import Cancelar from '../components/buttons/cancelButton';
import Guardar from '../components/buttons/saveButton';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { LuSend } from 'react-icons/lu';
import { IoCalendarNumberSharp } from "react-icons/io5";
import { useDropzone } from 'react-dropzone';
import { FaRegSave } from "react-icons/fa";
import { FiFile, FiVideo, FiFileText } from 'react-icons/fi';

const ModalAdicionarFicheiro = ({ 
  show, 
  handleClose, 
  // Define quais tipos de conteúdo são permitidos
  tiposPermitidos = ['documento', 'video', 'entrega'],
  // Tipo inicial selecionado (deve ser um dos permitidos)
  tipoInicial = 'documento',
  // Callback quando o upload for bem-sucedido
  onUploadSuccess = null,
  // ID do curso e módulo (se necessário para o backend)
  cursoId = null,
  moduloId = null
}) => {
  const [formData, setFormData] = useState({});
  const [tipoFicheiro, setTipoFicheiro] = useState(tipoInicial);
  const [ficheirosCarregados, setFicheirosCarregados] = useState([]);

  // Redefine o tipo de ficheiro quando os tipos permitidos mudam
  useEffect(() => {
    // Se o tipo atual não estiver na lista de permitidos, seleciona o primeiro permitido
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
      icon: <FiFileText size={20} />,
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
      cor: 'success',
      icon: <FiVideo size={20} />,
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
      icon: <FiFile size={20} />,
      descricao: 'Entregas de trabalhos (PDF, DOC, ZIP, RAR, etc.)'
    }
  };

  const configAtual = tiposConfig[tipoFicheiro] || tiposConfig.documento;

  const onDrop = (acceptedFiles) => {
    // Filtra os arquivos que estão dentro do tamanho permitido
    const arquivosValidos = acceptedFiles.filter(
      file => file.size <= configAtual.maxSize
    );
    
    if (arquivosValidos.length > 0) {
      setFicheirosCarregados([...ficheirosCarregados, ...arquivosValidos]);
    }
    
    // Alerta para arquivos muito grandes
    if (arquivosValidos.length !== acceptedFiles.length) {
      alert(`Alguns arquivos excedem o tamanho máximo de ${configAtual.maxSize / (1024 * 1024)}MB e foram ignorados.`);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
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

  const handleSubmit = () => {
    // Validação básica
    if (!formData.titulo || ficheirosCarregados.length === 0) {
      alert('Por favor, preencha o título e carregue pelo menos um arquivo.');
      return;
    }

    if (configAtual.requerData && !formData.dataentrega) {
      alert('Por favor, defina uma data de entrega.');
      return;
    }

    // Prepara os dados para enviar
    const dadosEnvio = {
      tipo: tipoFicheiro,
      titulo: formData.titulo,
      descricao: formData.descricao,
      dataEntrega: formData.dataentrega || null,
      ficheiros: ficheirosCarregados,
      cursoId,
      moduloId
    };

    console.log('Dados a enviar:', dadosEnvio);
    
    // Aqui você enviaria os dados para o servidor
    // Exemplo: await api.post('/ficheiros', dadosEnvio);
    
    // Callback de sucesso se fornecido
    if (onUploadSuccess) {
      onUploadSuccess(dadosEnvio);
    }
    
    alert('Ficheiro adicionado com sucesso!');
    limparFormulario();
    handleClose();
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
    <ModalCustom show={show} handleClose={handleClose} title="Adicionar Ficheiro" onSubmit={handleSubmit}>
      <Row className="justify-content-start mb-4">
        <Col md={12}>
          <div className="border p-4 shadow-sm rounded" style={{ backgroundColor: "#fff" }}>
            
            {/* Seleção de tipo de arquivo - só mostra se houver mais de um tipo permitido */}
            {tiposPermitidos.length > 1 && (
              <Row className="mb-4">
                <Col md={12}>
                  <Form.Label>Tipo de Conteúdo</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {tiposConfiguradosPermitidos.map(([tipo, config]) => (
                      <div 
                        key={tipo}
                        onClick={() => setTipoFicheiro(tipo)}
                        className={`d-flex align-items-center p-2 rounded cursor-pointer border ${tipoFicheiro === tipo ? `border-${config.cor} bg-${config.cor} bg-opacity-10` : 'border-secondary'}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={`me-2 text-${config.cor}`}>{config.icon}</div>
                        <div>
                          <div className="fw-bold">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</div>
                          <div className="small text-muted">{config.descricao}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            )}

            <Row className="mb-3">
              <InputField 
                label="Título" 
                type="text" 
                placeholder="Nome do ficheiro" 
                name="titulo" 
                value={formData.titulo || ''} 
                onChange={handleChange} 
                colSize={configAtual.requerData ? 6 : 12} 
              />
              
              {configAtual.requerData && (
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

            <Row className="mb-3">
              <InputField 
                label="Descrição" 
                type="textarea" 
                placeholder="Descrição do Ficheiro" 
                name="descricao" 
                value={formData.descricao || ''} 
                onChange={handleChange} 
                colSize={12} 
                rows={3} 
                style={{ resize: 'none' }} 
              />
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Label>Upload de Arquivos</Form.Label>
                <div 
                  {...getRootProps({ className: 'dropzone' })} 
                  style={{ 
                    border: `2px dashed #39639C`, 
                    padding: '20px', 
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '5px'
                  }}
                >
                  <input {...getInputProps()} />
                  <p className="mb-1">Arraste e solte ou clique para selecionar</p>
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
              <Row className="mb-3">
                <Col md={12}>
                  <div className="border rounded p-3">
                    <h6>Arquivos Selecionados:</h6>
                    <ul className="list-group">
                      {ficheirosCarregados.map((file, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <Badge bg={configAtual.cor} className="me-2">
                              {file.name.split('.').pop().toUpperCase()}
                            </Badge>
                            {file.name}
                            <span className="ms-2 text-muted small">
                              ({formatarTamanho(file.size)})
                            </span>
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => removerFicheiro(index)}
                          >
                            Remover
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            )}

            <div className="d-flex justify-content-center mt-4">
              <Cancelar text="Cancelar" onClick={handleClose} Icon={BsArrowReturnLeft} inline={true} />
              <Guardar 
                text={ficheirosCarregados.length > 0 ? "Adicionar" : "Selecione um arquivo"} 
                onClick={handleSubmit} 
                Icon={FaRegSave} 
                disabled={ficheirosCarregados.length === 0 || !formData.titulo}
              />
            </div>
          </div>
        </Col>
      </Row>
    </ModalCustom>
  );
};

export default ModalAdicionarFicheiro;