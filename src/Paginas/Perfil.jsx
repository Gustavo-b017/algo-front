// src/Paginas/Perfil.jsx
// -----------------------------------------------------------------------------
// Página de Perfil do Usuário
// Responsabilidades:
// - Carregar dados do usuário autenticado e preencher o formulário.
// - Permitir atualização de dados básicos (nome, telefone, avatar_url).
// - Permitir alteração de senha (senha_atual + nova_senha).
// - Sincronizar o estado global de usuário via useAuth.setUser.
// - Exibir feedbacks de erro e toast de sucesso.
//
// Diretrizes de manutenção (sem alterar a lógica original):
// - O carregamento inicial tenta obter o usuário com authMe() se o contexto
//   ainda não tiver user; depois, preenche o formulário local.
// - O submit é único para “Dados Pessoais” e para “Alterar Senha”; a distinção
//   acontece pela presença simultânea de senha_atual e nova_senha.
// - O redirecionamento para /login é feito quando não há user (mantido como no
//   original). Observação: há um uso de hook (useEffect) dentro de condicional;
//   embora funcione em muitos cenários, não é uma prática recomendada pelo
//   React. Idealmente, a proteção deveria ocorrer em um guard de rota
//   (ex.: <RequireAuth/>) ou movendo o hook para o topo do componente.
// - Estilos: SCSS modular por página e toast de sucesso.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { authMe, authUpdateMe } from "../lib/api";
import { useNavigate } from 'react-router-dom';

// Componentes de layout
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';
import avatarPlaceholder from '/public/imagens/perfil.jpeg'; 

import ProfileSuccessToast from '../Componentes/ProfileSuccessToast';
import '../../public/style/profileSuccessToast.scss';
import '../../public/style/perfil.scss';

export default function Perfil() {
  // Contexto de autenticação e controle de “readiness” da sessão
  const { user, setUser, ready } = useAuth();
  const navigate = useNavigate();

  // Estado local do formulário (dados básicos)
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", avatar_url: "" });
  // Campos de alteração de senha (mantidos separados do form principal)
  const [senha_atual, setSenhaAtual] = useState("");
  const [nova_senha, setNovaSenha] = useState("");

  // Feedback inline (erros) e estado de envio
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  // Toast de sucesso (UI não intrusiva)
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Carregamento inicial: se não houver user no contexto, tenta authMe()
  useEffect(() => {
    async function load() {
      if (!user) {
        const r = await authMe();
        if (r?.success) {
          setUser(r.user);
          setForm({
            nome: r.user.nome || "",
            email: r.user.email || "",
            telefone: r.user.telefone || "",
            avatar_url: r.user.avatar_url || "",
          });
        }
      } else {
        setForm({
          nome: user.nome || "",
          email: user.email || "",
          telefone: user.telefone || "",
          avatar_url: user.avatar_url || "",
        });
      }
    }
    if (ready) {
      load();
    }
  }, [user, setUser, ready]);

  // Enquanto o contexto não está pronto, exibe um loader de página inteira
  if (!ready) return (
    <div className="loader-container" style={{ height: '100vh' }}>
      <div className="loader-circle"></div>
    </div>
  );

  // Sem sessão: redireciona para /login (mantido como no original).
  // Observação: useEffect dentro de condicional é um padrão a evitar; idealmente
  // mover o guard para o topo ou proteger a rota via <RequireAuth/>.
  if (!user) {
    useEffect(() => { navigate("/login"); }, [navigate]);
    return null;
  }

  // Submit compartilhado (Dados pessoais e/ou Senha)
  async function salvar(e) {
    e.preventDefault();
    setFeedback({ type: "", message: "" }); // Limpa erros antigos
    setLoading(true);

    // Monta payload com dados pessoais sempre que houver submit
    const payload = {
      nome: form.nome,
      telefone: form.telefone,
      avatar_url: form.avatar_url,
    };

    // Detecta se haverá troca de senha neste submit
    let isUpdatingPassword = false;

    if (senha_atual && nova_senha) {
      isUpdatingPassword = true;
      // Regras mínimas de senha (mantidas do original)
      if (nova_senha.length < 3) {
        setFeedback({ type: "error", message: "A nova senha deve ter pelo menos 3 caracteres." });
        setLoading(false);
        return;
      }
      payload.senha_atual = senha_atual;
      payload.nova_senha = nova_senha;
    } else if (senha_atual || nova_senha) {
      // Caso preenchido apenas um dos campos, instrui o usuário
      setFeedback({ type: "error", message: "Para trocar a senha, preencha a senha atual e a nova senha." });
      setLoading(false);
      return;
    }

    try {
      // Chama a API de atualização
      const r = await authUpdateMe(payload);
      if (r?.success) {
        // Mantém o estado global do usuário em sincronia
        setUser(r.user);

        // Exibe TOAST de sucesso (mensagem varia se houve troca de senha)
        if (isUpdatingPassword) {
          setToastMessage("Senha atualizada com sucesso!");
        } else {
          setToastMessage("Dados atualizados com sucesso!");
        }
        setIsToastVisible(true);

        // Limpa os campos de senha
        setSenhaAtual("");
        setNovaSenha("");
      } else {
        // Feedback de erro (inline, não intrusivo)
        setFeedback({ type: "error", message: r?.error || "Falha ao atualizar o perfil." });
      }
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Erro de rede." });
    } finally {
      setLoading(false);
    }
  }
  
  // Fallback visual para avatar
  const displayAvatar = form.avatar_url || avatarPlaceholder;

  return (
    <div className="container">
      <Header />

      {/* Container principal da página (fundo cinza) */}
      <div className="perfil-page-container">

        {/* Wrapper de conteúdo (centralizado) */}
        <div className="perfil-content-wrapper">

          {/* Grid de layout (Sidebar + Conteúdo) */}
          <div className="perfil-main-content">

            {/* Coluna 1: Sidebar do Avatar */}
            <aside className="perfil-sidebar">
              <img
                src={displayAvatar}
                alt="Avatar do usuário"
                className="avatar-img"
                onError={(e) => { e.target.onerror = null; e.target.src = avatarPlaceholder; }}
              />
              <h3 className="avatar-greeting">Olá, {form.nome.split(" ")[0]}!</h3>
            </aside>

            {/* Coluna 2: Blocos de Formulário */}
            <main className="perfil-form-content">

              {/* Bloco 1: Dados Pessoais */}
              <div className="perfil-form-block">
                <form onSubmit={salvar}>
                  <h4>Dados Pessoais</h4>

                  <div className="form-group-perfil">
                    <label htmlFor="perfil-nome">Nome Completo</label>
                    <input id="perfil-nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} disabled={loading} />
                  </div>
                  <div className="form-group-perfil">
                    <label htmlFor="perfil-email">E-mail</label>
                    <input id="perfil-email" value={form.email} readOnly />
                  </div>
                  <div className="form-group-perfil">
                    <label htmlFor="perfil-telefone">Telefone</label>
                    <input id="perfil-telefone" placeholder="(11) 99999-9999" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} disabled={loading} />
                  </div>
                  <div className="form-group-perfil">
                    <label htmlFor="perfil-avatar">URL do Avatar (Opcional)</label>
                    <input id="perfil-avatar" placeholder="https://..." value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} disabled={loading} />
                  </div>

                  {/* Feedback de ERRO (Dados Pessoais) — exibido somente quando não é troca de senha */}
                  {feedback.message && feedback.type === "error" && !senha_atual && !nova_senha && (
                    <div className={`perfil-feedback ${feedback.type}`}>
                      {feedback.message}
                    </div>
                  )}

                  <button type="submit" className="btn-perfil" disabled={loading}>
                    {loading ? "SALVANDO..." : "SALVAR DADOS"}
                  </button>
                </form>
              </div>

              {/* Bloco 2: Troca de Senha */}
              <div className="perfil-form-block">
                <form onSubmit={salvar}>
                  <h4>Alterar Senha</h4>

                  <div className="form-group-perfil">
                    <label htmlFor="perfil-senha-atual">Senha atual</label>
                    <input id="perfil-senha-atual" type="password" value={senha_atual} onChange={e => setSenhaAtual(e.target.value)} disabled={loading} autoComplete="current-password" />
                  </div>
                  <div className="form-group-perfil">
                    <label htmlFor="perfil-nova-senha">Nova senha</label>
                    <input id="perfil-nova-senha" type="password" value={nova_senha} onChange={e => setNovaSenha(e.target.value)} disabled={loading} autoComplete="new-password" />
                  </div>

                  {/* Feedback de ERRO (Senha) — exibido somente quando há tentativa de troca */}
                  {feedback.message && feedback.type === "error" && (senha_atual || nova_senha) && (
                    <div className={`perfil-feedback ${feedback.type}`}>
                      {feedback.message}
                    </div>
                  )}

                  <button type="submit" className="btn-perfil" disabled={loading}>
                    {loading ? "ATUALIZANDO..." : "ATUALIZAR SENHA"}
                  </button>
                </form>
              </div>

            </main>

          </div>
        </div>
      </div>

      <Footer />

      {/* Toast de sucesso (mensagens de “Dados atualizados” / “Senha atualizada”) */}
      <ProfileSuccessToast
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        message={toastMessage}
      />
      
    </div>
  );
}
