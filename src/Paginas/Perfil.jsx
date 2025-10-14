import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { authMe, authUpdateMe } from "../lib/api";

export default function Perfil(){
  const { user, setUser, ready } = useAuth();
  const [form, setForm] = useState({ nome:"", email:"", telefone:"", avatar_url:"" });
  const [senha_atual, setSenhaAtual] = useState("");
  const [nova_senha, setNovaSenha] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load(){
      const r = await authMe();
      if(r?.success){
        setUser(r.user);
        setForm({
          nome: r.user.nome || "",
          email: r.user.email || "",
          telefone: r.user.telefone || "",
          avatar_url: r.user.avatar_url || "",
        });
      }
    }
    load();
  }, [setUser]);

  if(!ready) return null;
  if(!user) { window.location.href="/login"; return null; }

  async function salvar(e){
    e.preventDefault();
    setMsg("");
    const payload = {
      nome: form.nome,
      telefone: form.telefone,
      avatar_url: form.avatar_url,
    };
    if (senha_atual || nova_senha){
      payload.senha_atual = senha_atual;
      payload.nova_senha = nova_senha;
    }
    const r = await authUpdateMe(payload);
    if(r?.success){
      setUser(r.user);
      setMsg("Perfil atualizado!");
      setSenhaAtual(""); setNovaSenha("");
    }else{
      setMsg(r?.error || "Falha ao atualizar");
    }
  }

  return (
    <div style={{maxWidth: 720, margin:"32px auto", padding: "0 16px"}}>
      <h2>Meu Perfil</h2>
      <form onSubmit={salvar}>
        <div className="form-group">
          <label>Nome</label>
          <input value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})}/>
        </div>
        <div className="form-group">
          <label>E-mail (somente leitura)</label>
          <input value={form.email} readOnly />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input value={form.telefone} onChange={e=>setForm({...form, telefone:e.target.value})}/>
        </div>
        <div className="form-group">
          <label>Avatar URL</label>
          <input value={form.avatar_url} onChange={e=>setForm({...form, avatar_url:e.target.value})}/>
        </div>

        <h4>Trocar senha (opcional)</h4>
        <div className="form-group">
          <label>Senha atual</label>
          <input type="password" value={senha_atual} onChange={e=>setSenhaAtual(e.target.value)}/>
        </div>
        <div className="form-group">
          <label>Nova senha</label>
          <input type="password" value={nova_senha} onChange={e=>setNovaSenha(e.target.value)}/>
        </div>

        {msg && <p style={{marginTop:8}}>{msg}</p>}
        <button type="submit" className="create-account-btn">Salvar</button>
      </form>
    </div>
  );
}
