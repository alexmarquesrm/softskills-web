import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import axios from "../../config/configAxios";
import { Container, Row, Col, Form } from "react-bootstrap";
import profilePic from "../../logo.svg";
// COMPONENTES
import Guardar from "../../components/buttons/saveButton";
import InputField from "../../components/textFields/basic";
import Cancelar from "../../components/buttons/cancelButton";
import "../../modals/modalCustom";
// ICONS
import { FaRegSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobileAlt, FaUser, FaLock } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import { BsArrowReturnLeft } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaCamera, FaTrash } from "react-icons/fa";

export default function EditColab() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    primeiroNome: "", ultimoNome: "", username: "", dataNasc: "", email: "", telefone: "", departamento: "",
    cargo: "", sobre_mim: "", novaPassword: "", confirmarPassword: "", receberEmails: false, notificacoesForum: false,
    fotoPerfilUrl: ""
  });
  
  // Keep original name for display until save
  const [displayName, setDisplayName] = useState({
    primeiroNome: "",
    ultimoNome: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(profilePic);
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [imageSize, setImageSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const fileInputRef = React.createRef();

  useEffect(() => {
    if (formData.fotoPerfilUrl) {
      setPreviewFoto(formData.fotoPerfilUrl);
    }
  }, [formData.fotoPerfilUrl]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfil(reader.result);
        setPreviewFoto(reader.result);
        // Show success toast for image selection
        toast.success("Imagem selecionada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFoto = () => {
    setPreviewFoto(profilePic);
    setFotoPerfil(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Clear the photo URL in formData
    setFormData({
      ...formData,
      fotoPerfilUrl: ""
    });
    toast.info("Foto de perfil removida");
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getBase64FromUrl = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image URL to base64:", error);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const id = sessionStorage.getItem("colaboradorid");

      const response = await axios.get(`/colaborador/${id}`, {
        headers: { Authorization: `${token}` },
      });

      const utilizador = response.data;
      
      const primeiroNome = utilizador.nome ? utilizador.nome.split(" ")[0] : "";
      const ultimoNome = utilizador.nome ? utilizador.nome.split(" ").slice(1).join(" ") : "";

      setFormData({
        primeiroNome: primeiroNome,
        ultimoNome: ultimoNome,
        username: utilizador.username || "",
        dataNasc: utilizador.data_nasc || "",
        email: utilizador.email || "",
        telefone: utilizador.telefone || "",
        departamento: utilizador.departamento || "",
        cargo: utilizador.cargo || "",
        sobre_mim: utilizador.sobre_mim || "",
        novaPassword: "",
        confirmarPassword: "",
        fotoPerfilUrl: utilizador.fotoPerfilUrl || "",
        receberEmails: utilizador.receberEmails || false,
        notificacoesForum: utilizador.notificacoesForum || false
      });
      
      // Set display name separately from form data
      setDisplayName({
        primeiroNome: primeiroNome,
        ultimoNome: ultimoNome
      });

      // Set preview image if available
      if (utilizador.fotoPerfilUrl) {
        setPreviewFoto(utilizador.fotoPerfilUrl);
      }

      if (utilizador.imagem === undefined) {
        setImageName('');
        setImageSize(0);
        setImage('');
      } else {
        if (utilizador.imagem.url === '' || utilizador.imagem.url === null) {
          setImageName('');
          setImageSize(0);
          setImage('');
        } else {
          try {
            const base64String = await getBase64FromUrl(utilizador.imagem.url);
            if (base64String) {
              setImage(base64String);
              setImageName(utilizador.imagem.name);
              setImageSize(utilizador.imagem.size);
            }
          } catch (error) {
            console.error("Error processing image:", error);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do colaborador", error);
      toast.error("Erro ao carregar dados do perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardar = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const id = sessionStorage.getItem("colaboradorid");

      // Validação das senhas
      if (formData.novaPassword || formData.confirmarPassword) {
        if (formData.novaPassword !== formData.confirmarPassword) {
          toast.error("As palavras-passe não coincidem.");
          return;
        }
      }

      // Preparando o payload para envio
      const payload = {
        ...formData,
        nome: `${formData.primeiroNome} ${formData.ultimoNome}`.trim(),
      };

      // Adicionar foto de perfil se alterada
      if (fotoPerfil) {
        payload.fotoPerfil = {
          base64: fotoPerfil,
          nome: `foto_${id}.jpg`,
          entidade: 'colaborador',
          id,
        };
      }

      // Se nova senha foi fornecida, adiciona ao payload
      if (formData.novaPassword) {
        payload.password = formData.novaPassword;
      }

      // Removendo campos desnecessários do payload
      delete payload.confirmarPassword;
      delete payload.primeiroNome;
      delete payload.ultimoNome;

      // Enviar atualização ao servidor
      const response = await axios.put(`/colaborador/atualizar/${id}`, payload, {
        headers: { Authorization: `${token}` },
      });

      // Update display name after successful save
      setDisplayName({
        primeiroNome: formData.primeiroNome,
        ultimoNome: formData.ultimoNome
      });

      toast.success("Perfil atualizado com sucesso!");
      
      // Refresh data after update
      setTimeout(() => {
        fetchData();
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      toast.error("Erro ao atualizar perfil.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (isLoading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <h3>Carregando dados do perfil...</h3>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {/* Add ToastContainer for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: '60px' }} // Add margin to position below navbar
      />
      
      <Row className="justify-content-start">
        <Col md={10} className="mb-4">
          <h2 className="form-title">Perfil Utilizador</h2>
        </Col>
      </Row>

      <Row className="justify-content-start mb-4">
        <Col md={12}>
          <div className="border p-4 shadow-sm rounded">
            <Row className="mb-3" style={{ alignItems: "center" }}>
              <Col xs={4} sm={3} md={2} className="text-center">
                <div 
                  className="position-relative" 
                  style={{ width: "120px", height: "120px", margin: "0 auto" }}
                  onMouseEnter={() => setShowPhotoOptions(true)}
                  onMouseLeave={() => setShowPhotoOptions(false)}
                >
                  <img
                    src={previewFoto}
                    alt="Foto de Perfil"
                    className="rounded-circle perfil-img shadow-lg"
                    width="120"
                    height="120"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      console.error("Error loading profile image");
                      e.target.src = profilePic;
                    }}
                  />
                  
                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFotoChange} 
                    ref={fileInputRef} 
                    style={{ display: "none" }} 
                  />
                  
                  {/* Photo control overlay */}
                  {showPhotoOptions && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                      style={{ 
                        background: "rgba(0,0,0,0.5)", 
                        borderRadius: "50%",
                      }}
                    >
                      <div className="d-flex">
                        <div 
                          className="bg-primary p-2 rounded-circle mx-1" 
                          style={{ cursor: "pointer" }}
                          onClick={triggerFileInput}
                          title="Carregar nova foto"
                        >
                          <FaCamera color="white" size={20} />
                        </div>
                        
                        {previewFoto !== profilePic && (
                          <div 
                            className="bg-danger p-2 rounded-circle mx-1" 
                            style={{ cursor: "pointer" }}
                            onClick={handleRemoveFoto}
                            title="Remover foto"
                          >
                            <FaTrash color="white" size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={8} sm={9} md={10}>
                {/* Use displayName here instead of formData */}
                <h5 className="mt-3 perfil-nome">{displayName.primeiroNome} {displayName.ultimoNome}</h5>
                <p>{formData.cargo}</p>
              </Col>
            </Row>
            <hr />

            <Row className="mb-3">
              <InputField label="Primeiro Nome" name="primeiroNome" value={formData.primeiroNome} onChange={handleChange} colSize={6} />
              <InputField label="Último Nome" name="ultimoNome" value={formData.ultimoNome} onChange={handleChange} colSize={6} />
            </Row>

            <Row className="mb-3">
              <InputField label="Nome Utilizador" name="username" value={formData.username} onChange={handleChange} icon={<FaUser />} colSize={6} />
              <InputField label="Data Nascimento" name="dataNasc" value={formData.dataNasc} type="date" icon={<IoCalendarNumberSharp />} colSize={6} disabled readOnly />
            </Row>

            <Row className="mb-3">
              <InputField label="Email" name="email" value={formData.email} onChange={handleChange} icon={<MdEmail />} colSize={6} />
              <InputField label="Número Telemóvel" name="telefone" value={formData.telefone} onChange={handleChange} icon={<FaMobileAlt />} colSize={6} />
            </Row>

            <Row className="mb-3">
              <InputField label="Departamento" name="departamento" value={formData.departamento} onChange={handleChange} icon={<FaBuilding />} colSize={6} disabled readOnly />
              <InputField label="Cargo" name="cargo" value={formData.cargo} onChange={handleChange} colSize={6} disabled readOnly />
            </Row>

            <Row className="mb-3">
              <InputField label="Sobre Mim" name="sobre_mim" value={formData.sobre_mim} onChange={handleChange} type="textarea" rows={5} style={{ resize: "none" }} colSize={12} />
            </Row>

            <Row className="mb-3">
              <InputField label="Nova Password" name="novaPassword" value={formData.novaPassword} onChange={handleChange}
                type={showPassword ? "text" : "password"} icon={<FaLock />} colSize={6}
                endIcon={showPassword ? <FaEyeSlash /> : <FaEye />} onEndIconClick={() => setShowPassword(!showPassword)} />

              <InputField label="Confirmar Password" name="confirmarPassword" value={formData.confirmarPassword} onChange={handleChange}
                type={showConfirmPassword ? "text" : "password"} icon={<FaLock />} colSize={6}
                endIcon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />} onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <strong>Notificações</strong>
                  <Form.Check type="switch" id="receberEmails" label="Receber e-mails promocionais"
                    name="receberEmails" checked={formData.receberEmails} onChange={handleChange} className="form-switch" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Check type="switch" id="notificacoesForum" label="Notificações do Fórum"
                    name="notificacoesForum" checked={formData.notificacoesForum} onChange={handleChange} className="form-switch" />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Cancelar text={"Cancelar"} onClick={() => navigate("/")} Icon={BsArrowReturnLeft} inline={true} />
              <Guardar text={"Guardar"} onClick={handleGuardar} Icon={FaRegSave} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}