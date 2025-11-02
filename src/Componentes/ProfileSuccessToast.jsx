// src/Componentes/ProfileSuccessToast.jsx
import React, { useEffect, useState } from 'react';

// Ícone de checkmark (SVG puro)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="check-icon">
    <path d="M20 6L9 17L4 12" />
  </svg>
);

function ProfileSuccessToast({ isVisible, onClose, message }) {
    const [isHiding, setIsHiding] = useState(false);

    // Lógica de auto-dismiss (fechar após 4 segundos)
    useEffect(() => {
        if (isVisible) {
            setIsHiding(false);
            const timer = setTimeout(() => {
                onCloseHandler();
            }, 4000); 
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Handler para animação de saída
    const onCloseHandler = () => {
        setIsHiding(true);
        setTimeout(() => {
            onClose(); // Chama a função do pai para resetar o estado
            setIsHiding(false);
        }, 300); // Deve corresponder ao tempo da animação 'slideOut'
    };
    
    // Não renderiza nada se não estiver visível ou escondendo
    if (!isVisible && !isHiding) return null;

    return (
        <div className={`profile-success-toast ${isHiding ? 'hiding' : ''}`} role="status" aria-live="polite">
            <div className="toast-header">
                <CheckIcon />
                <p>{message || "Atualizado com sucesso!"}</p>
                <button onClick={onCloseHandler} className="close-btn" aria-label="Fechar notificação">&times;</button>
            </div>
        </div>
    );
}

export default ProfileSuccessToast;