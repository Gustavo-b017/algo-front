import React, { createContext, useContext, useEffect, useState } from "react";
import { authLogin, authMe } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (!t) { setReady(true); return; }
    authMe().then(r => {
      if (r?.success) setUser(r.user);
    }).finally(() => setReady(true));
  }, []);

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
  }

  return (
    <AuthCtx.Provider value={{ user, ready, login, logout, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

// opcional: também exporta como default para evitar erro caso importe sem chaves
export default AuthProvider;
