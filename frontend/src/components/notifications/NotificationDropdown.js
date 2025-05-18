import React, { useState, useEffect } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { BsBell } from 'react-icons/bs';
import axios from '../../config/configAxios';
import './NotificationDropdown.css';

function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const formandoId = sessionStorage.getItem('colaboradorid');
      if (!formandoId) return;

      const response = await axios.get(`/notificacao/formando/${formandoId}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.lida).length);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const markAsRead = async (notificacaoId) => {
    try {
      await axios.put(`/notificacao/${notificacaoId}/lida`);
      setNotifications(notifications.map(n => 
        n.notificacao_id === notificacaoId ? { ...n, lida: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/notificacao/marcar-todas-lidas');
      setNotifications(notifications.map(n => ({ ...n, lida: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  };

  // Custom toggle component
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      ref={ref}
      className="notification-toggle"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(!show);
      }}
    >
      <BsBell size={20} />
      {unreadCount > 0 && (
        <Badge bg="danger" className="notification-badge">
          {unreadCount}
        </Badge>
      )}
    </div>
  ));

  // Custom menu component
  const CustomMenu = React.forwardRef(
    ({ children, style, className }, ref) => {
      return (
        <div
          ref={ref}
          style={{ ...style, display: show ? 'block' : 'none' }}
          className={`${className} notification-dropdown-menu`}
        >
          {children}
        </div>
      );
    },
  );

  return (
    <div className="notification-dropdown-container">
      <Dropdown 
        show={show}
        onToggle={(isOpen) => setShow(isOpen)}
        align="end"
      >
        <Dropdown.Toggle as={CustomToggle} id="dropdown-notifications" />

        <Dropdown.Menu 
          as={CustomMenu}
          className="notification-dropdown-menu"
        >
          <div className="notification-header">
            <h6 className="mb-0">Notificações</h6>
            {unreadCount > 0 && (
              <button 
                className="btn btn-link btn-sm p-0"
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.notificacao_id}
                  className={`notification-item ${!notification.lida ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.notificacao_id)}
                >
                  <div className="notification-content">
                    {notification.descricao}
                  </div>
                  <div className="notification-time">
                    {new Date(notification.data_criacao).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default NotificationDropdown; 