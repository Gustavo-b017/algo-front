import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "/public/imagens/logo_ancora.svg";
import "../../public/style/cadastro.scss";

export default function Login() {
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/perfil";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) navigate("/", { replace: true });
  }, [ready, user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await login(email, senha);
      if (r?.success) navigate(from, { replace: true });
      else setErr(r?.error || "Falha no login");
    } catch {
      setErr("Erro de rede");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cadastro-page-container">
      <div className="background-azul"></div>
      <header className="cadastro-header">
        <img
          src={logo}
          alt="Logo Âncora"
          className="cadastro-logo"
          onClick={() => (window.location.href = "/")}
        />
      </header>

      <div className="cadastro-form-card">
        <div className="card-header">
          <h2>Entrar</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        <form className="cadastro-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="cadastro-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="cadastro-senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {err && <p style={{ color: "tomato", marginTop: 8 }}>{err}</p>}

          <button type="submit" className="create-account-btn" disabled={loading}>
            {loading ? "Entrando..." : "ENTRAR"}
          </button>
        </form>

        <p className="login-link">
          Ainda não tem conta? <a href="/cadastro">Crie a sua.</a>
        </p>
      </div>

      <div className="rodape-cadastro" role="contentinfo">
        <p>© 2025 pecacerta.com | Design by Gabriel de Mendonça</p>
      </div>
      
    </div>
  );
}
