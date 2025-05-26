import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import axios from './configAxios';

let app = null;
let auth = null;
let googleProvider = null;
let isInitializing = false;
let initializationPromise = null;

export const isFirebaseInitialized = () => {
    return !!app && !!auth && !!googleProvider;
};

export const initializeFirebase = async () => {
    if (isFirebaseInitialized()) {
        return true;
    }

    if (isInitializing && initializationPromise) {
        return initializationPromise;
    }

    try {
        isInitializing = true;
        
        initializationPromise = (async () => {
            const response = await axios.get('/colaborador/firebase-config');
            const firebaseConfig = response.data;
            
            if (!firebaseConfig.apiKey) {
                throw new Error('Configuração do Firebase incompleta: apiKey não encontrada');
            }

            const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
            const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Configuração do Firebase incompleta. Campos faltando: ${missingFields.join(', ')}`);
            }

            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            googleProvider = new GoogleAuthProvider();
            
            return true;
        })();

        return await initializationPromise;
    } catch (error) {
        app = null;
        auth = null;
        googleProvider = null;
        initializationPromise = null;
        throw error;
    } finally {
        isInitializing = false;
    }
};

const initFirebase = async () => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            await initializeFirebase();
            break;
        } catch (error) {
            attempts++;
            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
};

initFirebase();

export { auth, googleProvider }; 