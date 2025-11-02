// src/Paginas/Perfil.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { authMe, authUpdateMe } from "../lib/api";
import { useNavigate } from 'react-router-dom';

// Componentes de layout
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';
import avatarPlaceholder from '/public/imagens/perfil.jpeg'; //

import ProfileSuccessToast from '../Componentes/ProfileSuccessToast';
import '../../public/style/profileSuccessToast.scss';
import '../../public/style/perfil.scss';


export default function Perfil() {
  const { user, setUser, ready } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: "", email: "", telefone: "", avatar_url: "" });
  const [senha_atual, setSenhaAtual] = useState("");
  const [nova_senha, setNovaSenha] = useState("");

  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  if (!ready) return (
    <div className="loader-container" style={{ height: '100vh' }}>
      <div className="loader-circle"></div>
    </div>
  );

  if (!user) {
    useEffect(() => { navigate("/login"); }, [navigate]);
    return null;
  }

  async function salvar(e) {
    e.preventDefault();
    setFeedback({ type: "", message: "" }); // Limpa erros antigos
    setLoading(true);

    const payload = {
      nome: form.nome,
      telefone: form.telefone,
      avatar_url: form.avatar_url,
    };

    let isUpdatingPassword = false;

    if (senha_atual && nova_senha) {
      isUpdatingPassword = true;
      if (nova_senha.length < 3) {
        setFeedback({ type: "error", message: "A nova senha deve ter pelo menos 3 caracteres." });
        setLoading(false);
        return;
      }
      payload.senha_atual = senha_atual;
      payload.nova_senha = nova_senha;
    } else if (senha_atual || nova_senha) {
      setFeedback({ type: "error", message: "Para trocar a senha, preencha a senha atual e a nova senha." });
      setLoading(false);
      return;
    }

    try {
      const r = await authUpdateMe(payload);
      if (r?.success) {
        setUser(r.user);

        // SUBSTITUÍDO: Troca o feedback inline pelo TOAST
        if (isUpdatingPassword) {
          setToastMessage("Senha atualizada com sucesso!");
        } else {
          setToastMessage("Dados atualizados com sucesso!");
        }
        setIsToastVisible(true);

        setSenhaAtual("");
        setNovaSenha("");
      } else {
        // Mantém o feedback de ERRO inline
        setFeedback({ type: "error", message: r?.error || "Falha ao atualizar o perfil." });
      }
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Erro de rede." });
    } finally {
      setLoading(false);
    }
  }
  
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

                  {/* Feedback de ERRO (Dados Pessoais) */}
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

                  {/* Feedback de ERRO (Senha) */}
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

      {/* NOVO: Renderiza o Toast de Sucesso */}
      <ProfileSuccessToast
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        message={toastMessage}
      />
      
    </div>
  );
}