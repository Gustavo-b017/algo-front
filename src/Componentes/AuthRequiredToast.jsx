// src/Componentes/AuthRequiredToast.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Ícone de Alerta (SVG puro para evitar dependências)
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="alert-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.01" />
  </svg>
);

function AuthRequiredToast({ isVisible, onClose, redirectTo }) {
    const navigate = useNavigate();
    const [isHiding, setIsHiding] = useState(false);
    const DEFAULT_REDIRECT = '/login';

    // Lógica de auto-dismiss e animação de saída
    useEffect(() => {
        if (isVisible) {
            setIsHiding(false); // Garante que não esteja escondendo ao reaparecer
            const timer = setTimeout(() => {
                onCloseHandler();
            }, 6000); // 6 segundos para ler o aviso de login
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const onCloseHandler = () => {
        setIsHiding(true);
        // Espera a animação de saída (300ms) antes de chamar o onClose
        setTimeout(() => {
            onClose();
            setIsHiding(false);
        }, 300);
    };
    
    if (!isVisible && !isHiding) return null;

    const redirectTarget = redirectTo || DEFAULT_REDIRECT;

    return (
        <div className={`auth-required-toast ${isHiding ? 'hiding' : ''}`} role="alert">
            <div className="toast-header">
                <AlertIcon />
                <p>Ação Requerida</p>
                <button onClick={onCloseHandler} className="close-btn" aria-label="Fechar notificação">&times;</button>
            </div>
            
            <div className="toast-body">
                <p>Para continuar, você precisa estar logado ou criar uma conta.</p>
            </div>

            <div className="toast-actions">
                <button 
                    className="login-btn"
                    onClick={() => {
                        onCloseHandler();
                        navigate(redirectTarget);
                    }}
                >
                    FAZER LOGIN / CADASTRAR
                </button>
            </div>
        </div>
    );
}

export default AuthRequiredToast;