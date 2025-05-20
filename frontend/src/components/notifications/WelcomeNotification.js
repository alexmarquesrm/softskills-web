import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const WelcomeNotification = () => {
    const location = useLocation();
    const hasShownNotification = useRef(false);

    useEffect(() => {
        // Verifica se há uma mensagem de boas-vindas no estado da navegação e se ainda não foi exibida
        if (location.state?.welcomeMessage && !hasShownNotification.current) {
            toast.success(location.state.welcomeMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    marginTop: '60px' // Adiciona margem superior para descer a notificação
                }
            });

            // Marca que a notificação já foi exibida
            hasShownNotification.current = true;

            // Limpa o estado após exibir a mensagem
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return null; // Este componente não renderiza nada visualmente
};

export default WelcomeNotification; 