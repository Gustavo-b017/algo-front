// src/Componentes/AuthRequiredToast.jsx
// ============================================================================
// Toast de Autenticação Necessária (Frontend)
// ----------------------------------------------------------------------------
// Propósito
// - Exibir um aviso padronizado quando a ação do usuário exigir login/cadastro.
// - Centralizar o padrão de UX para esse caso, com mensagem clara e CTA único.
//
// Diretrizes (alinhadas ao back-end)
// - Responsabilidades claras: este componente só apresenta UI/fluxo visual;
//   a regra de negócio (quando abrir/fechar) fica no AuthProvider/telas.
// - Falhas previsíveis: sempre há um destino seguro de redirecionamento (/login).
// - Acessibilidade (a11y): uso de role="alert", sem dependências externas,
//   textos descritivos e controles com aria-label.
// - Extensibilidade: o tempo de auto-dismiss e o destino podem ser ajustados
//   no futuro (ver TODOs). Sem acoplamento a libs de terceiros.
// - Segurança: sem armazenar dados sensíveis; sem chamadas remotas;
//   somente navegação local controlada.
// ============================================================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------------
// Ícone de Alerta
// - SVG inline para evitar dependências e garantir consistência visual.
// - Traços simples para manter boa legibilidade em temas claros/escuros.
// ----------------------------------------------------------------------------
const AlertIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="alert-icon"
        aria-hidden="true"       // Ícone decorativo (texto vem ao lado)
        focusable="false"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.01"
        />
    </svg>
);

// ----------------------------------------------------------------------------
// AuthRequiredToast
// Props
// - isVisible: boolean que controla a exibição do toast.
// - onClose: callback obrigatório para fechar/limpar estado no chamador.
// - redirectTo: caminho para onde redirecionar (default '/login').
// Comportamento
// - Auto-dismiss em 6s (tempo suficiente para leitura, sem “agredir” a UX).
// - Animação de saída: guarda de estado `isHiding` por 300ms.
// - CTA único: direciona ao fluxo de login/cadastro.
// Notas de UX
// - Mensagem minimalista e direta, evitando jargões técnicos.
// - Botão de fechar com aria-label para leitores de tela.
// TODO
// - Tornar a duração do auto-dismiss configurável via prop (ex.: `autoCloseMs`).
// - Opcional: suportar React Portal para camadas de sobreposição (z-index).
// ----------------------------------------------------------------------------
function AuthRequiredToast({ isVisible, onClose, redirectTo }) {
    const navigate = useNavigate();
    const [isHiding, setIsHiding] = useState(false);

    // Destino seguro padrão
    const DEFAULT_REDIRECT = "/login";

    // --------------------------------------------------------------------------
    // Auto-dismiss e limpeza
    // - Ao exibir, inicia um timer para ocultar após 6s.
    // - Limpa o timer no unmount/reativação para evitar vazamentos.
    // --------------------------------------------------------------------------
    useEffect(() => {
        if (!isVisible) return;
        setIsHiding(false); // garante estado consistente ao reabrir

        const timer = setTimeout(() => {
            onCloseHandler();
        }, 6000); // 6 segundos de exposição

        return () => clearTimeout(timer);
    }, [isVisible]);

    // --------------------------------------------------------------------------
    // onCloseHandler()
    // - Dispara a animação de saída e só depois invoca `onClose`.
    // - Evita “piscadas” e garante que o componente remova-se após a transição.
    // --------------------------------------------------------------------------
    const onCloseHandler = () => {
        setIsHiding(true);
        setTimeout(() => {
            onClose?.();    // tolerante a ausência de callback
            setIsHiding(false);
        }, 300);          // duração da animação CSS de saída
    };

    // --------------------------------------------------------------------------
    // Render guard
    // - Evita custo de render quando não está visível nem escondendo.
    // --------------------------------------------------------------------------
    if (!isVisible && !isHiding) return null;

    const redirectTarget = redirectTo || DEFAULT_REDIRECT;

    // --------------------------------------------------------------------------
    // Renderização
    // - role="alert" para indicar prioridade de leitura aos leitores de tela.
    // - Botão de ação principal leva ao fluxo de autenticação e fecha o toast.
    // --------------------------------------------------------------------------
    return (
        <div
            className={`auth-required-toast ${isHiding ? "hiding" : ""}`}
            role="alert"
            aria-live="assertive"        // leitura imediata (o conteúdo é curto)
            aria-atomic="true"           // evita fragmentação de leitura
        >
            <div className="toast-header">
                <AlertIcon />
                <p>Ação requerida</p>
                <button
                    onClick={onCloseHandler}
                    className="close-btn"
                    aria-label="Fechar notificação"
                    type="button"
                >
                    &times;
                </button>
            </div>

            <div className="toast-body">
                <p>Para continuar, é necessário entrar na conta ou criar um cadastro.</p>
            </div>

            <div className="toast-actions">
                <button
                    className="login-btn"
                    type="button"
                    onClick={() => {
                        onCloseHandler();
                        // Navegação controlada: não depende de estado externo
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
