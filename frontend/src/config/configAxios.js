import axios from 'axios';

// Create axios instance with base URL
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://minecraftatm9.serveminecraft.net:9010'
});

// Default headers configuration
instance.defaults.headers.common['Content-Type'] = 'application/json';

// Add token to requests
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

// Response interceptor with improved error handling
instance.interceptors.response.use(
    response => response,
    error => {
        // Check if we should force logout based on error
        const shouldForceLogout = (
            error.response && 
            error.response.status === 401 && 
            // Don't force logout for these endpoints
            !error.config.url.includes('/login') &&
            !error.config.url.includes('/username/')
        );
        
        if (shouldForceLogout) {
            console.error('Session expired or unauthorized access');
            
            // Clear session storage
            sessionStorage.clear();
            localStorage.setItem('isLoggedOut', 'true');
            
            // Dispatch event that all tabs can listen to
            window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
            
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        // For 403 errors (Forbidden), we'll just pass them through to the component
        // so they can be handled appropriately (display error message, etc.)
        
        return Promise.reject(error);
    }
);

export default instance;