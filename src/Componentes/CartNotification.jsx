// src/Componentes/CartNotification.jsx
// ============================================================================
// Componente: CartNotification (toast de confirmação de item no carrinho)
// ----------------------------------------------------------------------------
// Propósito
// - Exibir, de forma discreta e não intrusiva, a confirmação de que um item foi
//   adicionado ao carrinho, com miniatura, nome, quantidade e preço unitário.
// - Oferecer atalho direto para a página do carrinho.
//
// Diretrizes (alinhadas ao back-end)
// - Responsabilidade única: apresentação e controle de exibição/fechamento.
//   A lógica de adicionar ao carrinho, autenticação e contagem global ocorre
//   fora daqui (via chamadas à API e contexto).
// - Previsibilidade: recebe `isVisible`, `onClose` e `productData` por props;
//   não mantém estado global nem persiste dados.
// - Robustez: se `isVisible=false` ou `productData` ausente, não renderiza.
// - Acessibilidade: usa `role="status"` e `aria-live="polite"` para leitores
//   de tela; botão de fechar com `aria-label`.
// - UX: auto-dismiss em 5s, com animação de saída; botão “VER CARRINHO”,
//   mantendo o fluxo convergente de compra.
//
// Requisitos de integração
// - CSS: requer as classes definidas em `/public/style/cartNotification.scss`
//   (o import pode ser feito na página; este componente não importa CSS por si).
// - Navegação: depende de `react-router-dom` (hook `useNavigate`).
// - `productData` deve conter, no mínimo:
//     { nomeProduto: string, preco_final: number, url_imagem: string, quantidade: number }
//
// Estados locais (somente UI)
// - `isHiding`: controla a classe para animação de saída antes do unmount.
//
// Ciclo de vida
// - Ao receber `isVisible=true`, inicia timer de 5s para fechar (auto-dismiss).
// - Ao fechar, ativa classe de saída por ~300ms e só então chama `onClose`.
//
// Observações de performance
// - Render superficial, sem listas/loops pesados.
// - Formatação de moeda isolada em utilitário simples.
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Ícone de checkmark simples (SVG puro para evitar dependências de arquivos)
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="check-icon">
        <path d="M20 6L9 17L4 12" />
    </svg>
);

// Função auxiliar para formatação BRL
const formatBRL = (v) =>
    typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

/**
 * CartNotification
 * @param {Object}   props
 * @param {boolean}  props.isVisible  - Controla a visibilidade do toast.
 * @param {Function} props.onClose    - Callback para esconder/remover o toast.
 * @param {Object}   props.productData - Dados do item recém-adicionado:
 *                                       { nomeProduto, preco_final, url_imagem, quantidade }
 */
function CartNotification({ isVisible, onClose, productData }) {
    const navigate = useNavigate();
    const [isHiding, setIsHiding] = useState(false);

    // Auto-dismiss: fecha automaticamente após 5s quando visível
    useEffect(() => {
        if (isVisible) {
            setIsHiding(false); // garante reset da animação ao reabrir
            const timer = setTimeout(() => {
                onCloseHandler();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Inicia a animação de saída (classe CSS) e, após 300ms, dispara onClose
    const onCloseHandler = () => {
        setIsHiding(true);
        setTimeout(() => {
            onClose();
            setIsHiding(false);
        }, 300); // manter em sincronia com a duração da animação CSS
    };

    // Não renderiza quando não há dados ou não está visível
    if (!isVisible || !productData) return null;

    const { nomeProduto, preco_final, url_imagem, quantidade } = productData;

    return (
        <div
            className={`cart-notification-toast ${isHiding ? 'hiding' : ''}`}
            role="status"
            aria-live="polite"
        >
            {/* Cabeçalho do toast: ícone, título e botão fechar */}
            <div className="toast-header">
                <CheckIcon />
                <p>Adicionado ao carrinho</p>
                <button
                    onClick={onCloseHandler}
                    className="close-btn"
                    aria-label="Fechar notificação"
                >
                    &times;
                </button>
            </div>

            {/* Corpo do toast: miniatura e informações resumidas */}
            <div className="toast-body">
                <img src={url_imagem} alt={nomeProduto} className="product-thumb" />
                <div className="product-info">
                    <p className="produto-nome"><strong>{nomeProduto}</strong></p>
                    <span>{quantidade}x | {formatBRL(preco_final)}</span>
                </div>
            </div>

            {/* Ações: atalho de navegação para o carrinho */}
            <div className="toast-actions">
                <button
                    className="view-cart-btn"
                    onClick={() => {
                        onCloseHandler();   // fecha antes de navegar
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
