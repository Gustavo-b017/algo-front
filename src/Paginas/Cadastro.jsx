import React, { useState } from 'react';
import '/public/style/cadastro.scss';
import logo from '/public/imagens/logo_ancora.svg';
import { authRegister } from '../lib/api';

function Cadastro() {
    const [primeiroNome, setPrimeiroNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr(""); setOk("");
        try {
            const r = await authRegister({ nome: primeiroNome, email, senha });
            if (r?.success) {
                setOk("Conta criada! Faça login para continuar.");
                setTimeout(() => window.location.href = "/login", 600);
            } else {
                setErr(r?.error || "Falha ao cadastrar");
            }
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
                    <h2>Crie uma conta</h2>
                    <p>Maneira simples e rápida de continuar suas compras</p>
                </div>

                <form className="cadastro-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="primeiroNome">Primeiro Nome</label>
                        <input id="primeiroNome" value={primeiroNome} onChange={e => setPrimeiroNome(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Endereço de email</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <div className="password-input-wrapper">
                            <input id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
                            <span className="eye-icon">
                                {/* Ícone de olho (substitua por um SVG ou ícone real se tiver) */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.183a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.183z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <input type="checkbox" id="termos" />
                        <label htmlFor="termos">Eu li e concordo com os termos de uso</label>
                    </div>

                    <button type="submit" className="create-account-btn">
                        CRIAR CONTA
                    </button>
                    
                    {err && <p style={{ color: "tomato", marginTop: 8 }}>{err}</p>}
                    {ok && <p style={{ color: "seagreen", marginTop: 8 }}>{ok}</p>}
                </form>

                <div className="separator">ou se inscreva com</div>

                <div className="social-login">
                    <button className="social-btn google-btn">
                        {/* Ícone do Google */}
                        <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
                    </button>
                    <button className="social-btn apple-btn">
                        {/* Ícone da Apple */}
                        <img src="https://img.icons8.com/sf-regular-filled/48/000000/apple.png" alt="Apple" />
                    </button>
                    <button className="social-btn facebook-btn">
                        {/* Ícone do Facebook */}
                        <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" />
                    </button>
                </div>

                <p className="login-link">
                    Já possui uma conta? <a href="/login">Faça o LOGIN</a>
                </p>
            </div>

            <div className="rodapé-cadastro"><p>© 2025 pecacerta.com | Design by Gabriel de Mendonça</p></div>
        </div>
    );
}

export default Cadastro;