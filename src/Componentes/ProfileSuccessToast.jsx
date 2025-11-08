// src/Componentes/ProfileSuccessToast.jsx
// ============================================================================
// Componente: ProfileSuccessToast
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir um toast de sucesso (curto e não intrusivo) após ações de perfil,
//   como atualização de dados e alteração de senha.
//
// Diretrizes arquiteturais (alinhadas ao back)
// - Responsabilidade única (SRP): apenas renderiza o aviso e controla o ciclo
//   de vida (auto-dismiss + animação de saída). Nenhuma regra de negócio.
// - Contrato explícito de props: controla exibição via `isVisible` e finaliza
//   via `onClose`, com mensagem customizável em `message`.
// - UX previsível: auto-dismiss com timeout e botão de fechar; transição suave
//   com classe `hiding` sincronizada ao CSS.
// - Acessibilidade: `role="status"` + `aria-live="polite"` para leitores de tela.
// - Extensibilidade: pronto para receber botões de ação (ex.: “Ver Perfil”).
//
// Contrato de props
// - isVisible: boolean — controla a visibilidade do toast.
// - onClose:   function — callback obrigatório para o pai ocultar/desmontar.
// - message:   string   — mensagem exibida (fallback “Atualizado com sucesso!”).
//
// Fluxo de funcionamento
// 1) Ao receber `isVisible = true`, inicia um timer (4s) que chama `onCloseHandler`.
// 2) `onCloseHandler` aplica classe `hiding` por 300ms (animação CSS) e depois
//    chama `onClose` para o componente pai remover/ocultar o toast.
// 3) Enquanto `isVisible` é falso, mas estamos animando a saída (`isHiding = true`),
//    o componente ainda renderiza para concluir a animação.
//
// Notas de integração
// - O pai deve zerar o estado após `onClose` para evitar reabertura acidental.
// - Garanta que o CSS defina as animações para `.profile-success-toast` e `.hiding`.
// - Evite toasts sobrepostos: mantenha um único componente global ou fila.
//
// Testes sugeridos
// - Renderiza com `isVisible = true` e some após ~4s.
// - Clique no “x” dispara saída imediata e chama `onClose` após ~300ms.
// - Mudança rápida de `isVisible` não quebra a animação (limpeza do timer).
// ============================================================================

import React, { useEffect, useState } from 'react';

// Ícone de checkmark (SVG puro)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="check-icon">
    <path d="M20 6L9 17L4 12" />
  </svg>
);

function ProfileSuccessToast({ isVisible, onClose, message }) {
    const [isHiding, setIsHiding] = useState(false);

    // Auto-dismiss: inicia/renova o timer sempre que `isVisible` ficar true.
    // O cleanup garante que timers antigos não disparem após desmontagem.
    useEffect(() => {
        if (isVisible) {
            setIsHiding(false);
            const timer = setTimeout(() => {
                onCloseHandler();
            }, 4000); 
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Sincroniza a duração da animação de saída com o CSS (300ms).
    // Primeiro aplica a classe de saída; após o delay, chama `onClose`.
    const onCloseHandler = () => {
        setIsHiding(true);
        setTimeout(() => {
            onClose(); // Delega ao pai a responsabilidade de ocultar/desmontar
            setIsHiding(false);
        }, 300); // Deve corresponder ao tempo da animação 'slideOut'
    };
    
    // Curto-circuito: não renderiza quando está totalmente oculto.
    // Se estiver animando a saída (`isHiding`), mantém na árvore até concluir.
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
