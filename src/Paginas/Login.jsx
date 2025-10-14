import React, { useState } from "react";
import { useAuth } from "../contexts/auth-context";
import logo from "/public/imagens/logo_ancora.svg";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const r = await login(email, senha);
      if (r?.success) window.location.href = "/perfil";
      else setErr(r?.error || "Falha no login");
    } catch {
      setErr("Erro de rede");
    }
  }

  return (
    <div className="cadastro-page-container">
      <div className="background-azul"></div>
      <header className="cadastro-header">
        <img src={logo} alt="Logo Âncora" className="cadastro-logo" onClick={() => window.location.href = "/"} />
      </header>

      <div className="cadastro-form-card">
        <div className="card-header">
          <h2>Entrar</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        <form className="cadastro-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} required />
          </div>
          {err && <p style={{color: "tomato", marginTop: 8}}>{err}</p>}
          <button type="submit" className="create-account-btn">ENTRAR</button>
        </form>

        <p className="login-link">Ainda não tem conta? <a href="/cadastro">Crie a sua.</a></p>
      </div>
    </div>
  );
}
