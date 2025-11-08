// src/contexts/auth-context.jsx
// ============================================================================
// Contexto de Autenticação (Frontend)
// ----------------------------------------------------------------------------
// Propósito
// - Centralizar sessão de usuário, login/logout e sincronização do contador do
//   carrinho, expondo uma API simples via hook `useAuth()`.
// - Fornecer um mecanismo padronizado para alertar o usuário quando uma ação
//   exigir autenticação (toast global).
//
// Diretrizes (alinhadas ao back-end)
// - Responsabilidades bem seccionadas com comentários de cabeçalho.
// - Erros tratados de forma previsível e mensagens limpas para a UI.
// - Efeitos colaterais explícitos (persistência de token, redirecionamentos).
// - Preferir ponto único de verdade para o token (ver TODO no método `login`).
//
// Segurança
// - Token em localStorage (convencional neste projeto). Em produção real, avaliar
//   riscos de XSS e, se possível, adotar cookies httpOnly + SameSite.
// ============================================================================

import React, { createContext, useContext, useEffect, useState } from "react";
import { authLogin, authMe, cartCount } from "../lib/api";
import AuthRequiredToast from "../Componentes/AuthRequiredToast"; // UI de alerta
import "/public/style/authRequiredToast.scss"; // Estilos do toast

// ----------------------------------------------------------------------------
// Criação do contexto e Provider
// ----------------------------------------------------------------------------
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // ---- Estado principal da sessão ------------------------------------------
  const [user, setUser] = useState(null);   // usuário autenticado (ou null)
  const [ready, setReady] = useState(false); // hidratação inicial concluída
  const [cartItemCount, setCartItemCount] = useState(0); // contador do carrinho

  // ---- Estado do toast "login necessário" ----------------------------------
  // Evita espalhar modais/toasts por telas; fica centralizado aqui.
  const [loginAlert, setLoginAlert] = useState({ isVisible: false, redirectTo: null });

  // ----------------------------------------------------------------------------
  // fetchCartCount()
  // - Lê a quantidade total de itens a partir do GET /carrinho (via lib/api).
  // - Fallback: se não houver token/usuário, zera a contagem.
  // ----------------------------------------------------------------------------
  async function fetchCartCount() {
    try {
      const hasToken = localStorage.getItem("access_token");
      if (!user && !hasToken) {
        setCartItemCount(0);
        return;
      }
      const r = await cartCount();
      setCartItemCount(r?.count ?? 0);
    } catch (e) {
      // Log leve apenas para diagnóstico; UI não precisa detalhar aqui.
      console.error("Erro ao buscar contagem do carrinho:", e);
      setCartItemCount(0);
    }
  }

  // ----------------------------------------------------------------------------
  // Bootstrap da sessão
  // - Ao montar, tenta recuperar o token local e consultar /auth/me.
  // - Em sucesso, popula `user`; em qualquer caso, marca `ready = true`.
  // - Em seguida, sincroniza o contador do carrinho.
  // ----------------------------------------------------------------------------
  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (!t) {
      setReady(true); // nada a autenticar
      return;
    }
    authMe()
      .then((r) => {
        if (r?.success) setUser(r.user);
      })
      .finally(() => {
        setReady(true);
        fetchCartCount(); // contagem inicial após a hidratação
      });
  }, []);

  // ----------------------------------------------------------------------------
  // triggerLoginAlert()
  // - API para telas/componentes dispararem o toast "login necessário".
  // - Protege contra reentrância (não "spamma" o toast).
  // ----------------------------------------------------------------------------
  const triggerLoginAlert = (redirectTo = "/login") => {
    if (loginAlert.isVisible) return; // já aberto
    setLoginAlert({ isVisible: true, redirectTo });
  };

  // ----------------------------------------------------------------------------
  // login()
  // - Encapsula POST /auth/login, persiste token e popula `user`.
  // - Retorna o payload para que a tela possa decidir navegação/feedback.
  // TODO (alinhamento fino): centralizar persistência do token com setToken()
  //                          exposto por lib/api para manter fonte única.
  // ----------------------------------------------------------------------------
  async function login(email, senha) {
    const r = await authLogin({ email, senha });
    if (r?.success) {
      localStorage.setItem("access_token", r.token); // ver TODO acima
      setUser(r.user);
      // Opcionalmente, sincroniza o carrinho imediatamente após login:
      fetchCartCount();
    }
    return r;
  }

  // ----------------------------------------------------------------------------
  // logout()
  // - Limpa token/sessão local e zera contador do carrinho.
  // ----------------------------------------------------------------------------
  function logout() {
    localStorage.removeItem("access_token");
    setUser(null);
    setCartItemCount(0);
  }

  // ----------------------------------------------------------------------------
  // Recalcula contador sempre que `user` ou `ready` mudarem.
  // - Garante consistência após login/logout/edição de perfil.
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (ready) fetchCartCount();
  }, [user, ready]);

  // ----------------------------------------------------------------------------
  // Exposição do contexto
  // - Mantém API mínima e coerente com as telas.
  // ----------------------------------------------------------------------------
  return (
    <AuthCtx.Provider
      value={{
        user,
        ready,
        login,
        logout,
        setUser,
        cartItemCount,
        fetchCartCount,
        triggerLoginAlert,
      }}
    >
      {children}

      {/* ----------------------------------------------------------------------
          Toast global "login necessário"
          - Vive aqui para evitar duplicação nas páginas.
          - Controlado via estado local (loginAlert).
         ---------------------------------------------------------------------- */}
      <AuthRequiredToast
        isVisible={loginAlert.isVisible}
        onClose={() => setLoginAlert({ isVisible: false, redirectTo: null })}
        redirectTo={loginAlert.redirectTo}
      />
    </AuthCtx.Provider>
  );
}

// ----------------------------------------------------------------------------
// Hook de consumo do contexto
// - Preferir este hook a consumir AuthCtx diretamente.
// ----------------------------------------------------------------------------
export const useAuth = () => useContext(AuthCtx);

// ----------------------------------------------------------------------------
// Export default (opcional)
// ----------------------------------------------------------------------------
export default AuthProvider;
