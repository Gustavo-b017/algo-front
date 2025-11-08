// src/Paginas/Login.jsx
// -----------------------------------------------------------------------------
// Tela de Login
// Responsabilidades:
// - Autenticar o usuário via contexto (useAuth.login) e redirecionar para a rota
//   de origem (location.state.from.pathname) ou /perfil por padrão.
// - Exibir formulário controlado com campos de e-mail e senha.
// - Tratar estados de carregamento e mensagens de erro.
//
// Observações de manutenção:
// - A navegação pós-login usa o React Router: se a rota protegida empurrou o
//   usuário para /login com { state: { from } }, voltamos para 'from' após sucesso.
// - O efeito em `ready && user` evita exibir a tela se já houver sessão válida.
// - Os estilos são reutilizados da tela de cadastro (SCSS compartilhado).
// - Em aplicações SPA, prefira `navigate("/")` ao invés de `window.location.href`
//   para preservar o estado do app; aqui mantido como no original.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "/public/imagens/logo_ancora.svg";
import "../../public/style/cadastro.scss";

export default function Login() {
  // Contexto de autenticação: fornece login(), user e flag ready (injeção concluída)
  const { login, user, ready } = useAuth();

  // Navegação e origem do redirecionamento pós-login
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/perfil";

  // Estado controlado do formulário e UI
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Se já estiver autenticado e o contexto pronto, não exibe a página de login
  useEffect(() => {
    if (ready && user) navigate("/", { replace: true });
  }, [ready, user, navigate]);

  /**
   * Envio do formulário:
   * - Reseta erro, aciona loading.
   * - Chama login(email, senha) do contexto; espera { success, error }.
   * - Redireciona para a rota de origem em caso de sucesso.
   */
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
      {/* Fundo decorativo compartilhado com a tela de cadastro */}
      <div className="background-azul"></div>

      {/* Cabeçalho com logo (mantido: navegação via location.href) */}
      <header className="cadastro-header">
        <img
          src={logo}
          alt="Logo Âncora"
          className="cadastro-logo"
          onClick={() => (window.location.href = "/")}
        />
      </header>

      {/* Card do formulário de login */}
      <div className="cadastro-form-card">
        <div className="card-header">
          <h2>Entrar</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        {/* Formulário controlado (sem validações complexas no front) */}
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

          {/* Feedback de erro simples (pode ser evoluído para toast/alert acessível) */}
          {err && <p style={{ color: "tomato", marginTop: 8 }}>{err}</p>}

          <button type="submit" className="create-account-btn" disabled={loading}>
            {loading ? "Entrando..." : "ENTRAR"}
          </button>
        </form>

        {/* Link auxiliar para cadastro de novos usuários */}
        <p className="login-link">
          Ainda não tem conta? <a href="/cadastro">Crie a sua.</a>
        </p>
      </div>

      {/* Rodapé institucional */}
      <div className="rodape-cadastro" role="contentinfo">
        <p>© 2025 pecacerta.com | Projeto by G³ </p>
      </div>
      
    </div>
  );
}
