import axios from 'axios';

// Criar instância do axios com a URL base
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
});

// Configuração padrão de headers
instance.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptador para adicionar o token de autorização em todas as requisições
instance.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Interceptador para tratar erros de resposta
instance.interceptors.response.use(
    response => response,
    error => {
        // Verificar se é erro de autenticação
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Erro de autenticação:', error.response.data);
            
            // Limpar dados da sessão
            sessionStorage.clear();
            
            // Redirecionar para a página de login
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default instance;