import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "/public/style/cadastro.scss";
import logo from "/public/imagens/logo_ancora.svg";
import { authRegister } from "../lib/api";

function Cadastro() {
    const [primeiroNome, setPrimeiroNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function validarCampos() {
        if (!primeiroNome.trim()) return "Informe seu nome.";
        const em = email.trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(em)) return "Endereço de e-mail inválido.";
        if (senha.length < 3) return "A senha deve ter pelo menos 3 caracteres.";
        if (!aceitouTermos) return "Você precisa aceitar os termos de uso.";
        return "";
    }

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        setOk("");

        const erroValidacao = validarCampos();
        if (erroValidacao) {
            setErr(erroValidacao);
            return;
        }

        setLoading(true);
        try {
            const res = await authRegister({
                nome: primeiroNome.trim(),
                email: email.trim().toLowerCase(),
                senha,
            });

            if (res?.success) {
                setOk("Conta criada! Redirecionando para o login…");
                setTimeout(() => navigate("/login"), 800);
            } else {
                setErr(res?.error || "Falha ao cadastrar.");
            }
        } catch (e) {
            setErr(e?.message || "Erro de rede.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="cadastro-page-container">
            <div className="background-azul" aria-hidden="true"></div>

            <header className="cadastro-header">
                <img
                    src={logo}
                    alt="Logo Âncora"
                    className="cadastro-logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                    height={70}
                />
            </header>

            <div className="cadastro-form-card" role="region" aria-labelledby="titulo-cadastro">
                <div className="card-header">
                    <h2 id="titulo-cadastro">Crie uma conta</h2>
                    <p>Maneira simples e rápida de continuar suas compras</p>
                </div>

                <form className="cadastro-form" onSubmit={onSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="primeiroNome">Primeiro Nome</label>
                        <input
                            id="primeiroNome"
                            value={primeiroNome}
                            className="cadastro-nome"
                            onChange={(e) => setPrimeiroNome(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="given-name"
                            inputMode="text"
                            placeholder="Seu nome"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Endereço de e-mail</label>
                        <input
                            id="email"
                            type="email"
                            className="cadastro-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="email"
                            inputMode="email"
                            placeholder="voce@exemplo.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <div className="password-input-wrapper">
                            <input
                                id="senha"
                                className="cadastro-senha"
                                type={mostrarSenha ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                disabled={loading}
                                autoComplete="new-password"
                                placeholder="Crie uma senha"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                onClick={() => setMostrarSenha((v) => !v)}
                                disabled={loading}
                                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {/* Olho simples em SVG, sem dependências */}
                                {mostrarSenha ? (
                                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
                                        <path d="M10.58 10.58A3 3 0 0113.42 13.4M4.12 7.12A12.94 12.94 0 0112 5c6.5 0 10 7 10 7a20.3 20.3 0 01-4.22 5.17M6.53 9.53A12.26 12.26 0 002 12s3.5 7 10 7a12.3 12.3 0 006.29-1.77" fill="none" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="termos"
                            checked={aceitouTermos}
                            onChange={(e) => setAceitouTermos(e.target.checked)}
                            disabled={loading}
                        />
                        <label htmlFor="termos">
                            Eu li e concordo com os <Link to="/termos" className="link-inline">termos de uso</Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="create-account-btn"
                        disabled={loading || !aceitouTermos}
                    >
                        {loading ? "ENVIANDO..." : "CRIAR CONTA"}
                    </button>

                    {/* Renderização condicional: só renderiza o container se houver erro OU sucesso */}
                    {(err || ok) && (
                        <div className="form-feedback" aria-live="polite" aria-atomic="true">
                            {err && <p className="msg error">{err}</p>}
                            {ok && <p className="msg success">{ok}</p>}
                        </div>
                    )}
                </form>

                <div className="separator" role="separator" aria-label="ou">ou se inscreva com</div>

                <div className="social-login" aria-label="Opções de cadastro social">
                    <button className="social-btn google-btn" type="button" disabled={loading} title="Entrar com Google">
                        <img
                            src="https://img.icons8.com/color/48/000000/google-logo.png"
                            alt="Google"
                            width={30}
                            height={30}
                            loading="lazy"
                        />
                    </button>
                    <button className="social-btn apple-btn" type="button" disabled={loading} title="Entrar com Apple">
                        <img
                            src="https://img.icons8.com/sf-regular-filled/48/000000/apple.png"
                            alt="Apple"
                            width={30}
                            height={30}
                            loading="lazy"
                        />
                    </button>
                    <button className="social-btn facebook-btn" type="button" disabled={loading} title="Entrar com Facebook">
                        <img
                            src="https://img.icons8.com/color/48/000000/facebook-new.png"
                            alt="Facebook"
                            width={30}
                            height={30}
                            loading="lazy"
                        />
                    </button>
                </div>

                <p className="login-link">
                    Já possui uma conta? <Link to="/login">Faça o LOGIN</Link>
                </p>
            </div>

            <div className="rodape-cadastro" role="contentinfo">
                <p>© 2025 pecacerta.com | Design by Gabriel de Mendonça</p>
            </div>
        </div>
    );
}

export default Cadastro;
