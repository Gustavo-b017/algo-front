import React, { createContext, useContext, useEffect, useState } from "react";
import { authLogin, authMe, cartCount } from "../lib/api";
import AuthRequiredToast from '../Componentes/AuthRequiredToast'; // NOVO: Importa o Toast
import "/public/style/authRequiredToast.scss"; // NOVO: Importa o estilo

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // NOVO: Estado para gerenciar o Toast de Login/Cadastro
  const [loginAlert, setLoginAlert] = useState({ isVisible: false, redirectTo: null });

  // NOVO: Função para buscar e definir a contagem
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
      console.error("Erro ao buscar contagem do carrinho:", e);
      setCartItemCount(0);
    }
  }

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (!t) { setReady(true); return; }

    authMe().then(r => {
      if (r?.success) setUser(r.user);
    }).finally(() => {
      setReady(true);
      // Chamada inicial para buscar a contagem após a autenticação
      fetchCartCount();
    });
  }, []);

  // NOVO: Função exportada para disparar o toast de autenticação
  const triggerLoginAlert = (redirectTo = '/login') => {
    // Se já estiver visível, não faz nada (evita spam)
    if (loginAlert.isVisible) return;
    setLoginAlert({ isVisible: true, redirectTo });
  };

  async function login(email, senha) {
    const r = await authLogin({ email, senha });
    if (r?.success) {
      localStorage.setItem("access_token", r.token);
      setUser(r.user);
    }
    return r;
  }

  function logout() {
    localStorage.removeItem("access_token");
    setUser(null);
    setCartItemCount(0); // NOVO: Zera contagem no logout
  }

  // NOVO: Sincroniza a contagem quando o estado de autenticação mudar
  useEffect(() => {
    if (ready) {
      fetchCartCount();
    }
  }, [user, ready]);

  return (
    <AuthCtx.Provider value={{
      user, ready, login, logout, setUser,
      cartItemCount, fetchCartCount,
      triggerLoginAlert
    }}>
      {children}

      {/* NOVO: Renderiza o Toast globalmente aqui dentro. */}
      {/* Ele usa o state e o setter locais (setLoginAlert) */}
      <AuthRequiredToast
          isVisible={loginAlert.isVisible}
          onClose={() => setLoginAlert({ isVisible: false, redirectTo: null })}
          redirectTo={loginAlert.redirectTo}
      />
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

// opcional: também exporta como default para evitar erro caso importe sem chaves
export default AuthProvider;
