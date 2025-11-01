// src/Componentes/CartNotification.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Ícone de checkmark simples (usando SVG puro para evitar dependências de arquivos)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="check-icon">
    <path d="M20 6L9 17L4 12" />
  </svg>
);

// Função auxiliar para formatação BRL
const formatBRL = (v) =>
  typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

function CartNotification({ isVisible, onClose, productData }) {
    const navigate = useNavigate();
    const [isHiding, setIsHiding] = useState(false);

    // Lógica de auto-dismiss (fechar após 5 segundos)
    useEffect(() => {
        if (isVisible) {
            setIsHiding(false);
            const timer = setTimeout(() => {
                onCloseHandler();
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Função para iniciar a animação de saída antes de fechar o componente
    const onCloseHandler = () => {
        setIsHiding(true);
        setTimeout(() => {
            onClose();
            setIsHiding(false);
        }, 300); // Tempo da animação 'slideOut'
    };
    
    if (!isVisible || !productData) return null;

    const { nomeProduto, preco_final, url_imagem, quantidade } = productData;

    return (
        <div className={`cart-notification-toast ${isHiding ? 'hiding' : ''}`} role="status" aria-live="polite">
            <div className="toast-header">
                <CheckIcon />
                <p>Adicionado ao carrinho</p>
                <button onClick={onCloseHandler} className="close-btn" aria-label="Fechar notificação">&times;</button>
            </div>
            
            <div className="toast-body">
                <img src={url_imagem} alt={nomeProduto} className="product-thumb" />
                <div className="product-info">
                    <p className="produto-nome"><strong>{nomeProduto}</strong></p>
                    <span>{quantidade}x | {formatBRL(preco_final)}</span>
                </div>
            </div>

            <div className="toast-actions">
                <button 
                    className="view-cart-btn"
                    onClick={() => {
                        onCloseHandler();
                        navigate('/carrinho');
                    }}
                >
                    VER CARRINHO
                </button>
            </div>
        </div>
    );
}

export default CartNotification;