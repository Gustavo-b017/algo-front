import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            <div className="background-azul"></div>

            <header className="cadastro-header">
                <img
                    src={logo}
                    alt="Logo Âncora"
                    className="cadastro-logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                />
            </header>

            <div className="cadastro-form-card">
                <div className="card-header">
                    <h2>Crie uma conta</h2>
                    <p>Maneira simples e rápida de continuar suas compras</p>
                </div>

                <form className="cadastro-form" onSubmit={onSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="primeiroNome">Primeiro Nome</label>
                        <input
                            id="primeiroNome"
                            value={primeiroNome}
                            onChange={(e) => setPrimeiroNome(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="given-name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Endereço de email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <div className="password-input-wrapper">
                            <input
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                disabled={loading}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="eye-icon"
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                onClick={() => setMostrarSenha((v) => !v)}
                                disabled={loading}
                            >
                                {/* Ícone simples (você pode trocar por seu SVG/ícone) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.183a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.183z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
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
                        <label htmlFor="termos">Eu li e concordo com os termos de uso</label>
                    </div>

                    <button
                        type="submit"
                        className="create-account-btn"
                        disabled={loading || !aceitouTermos}
                    >
                        {loading ? "ENVIANDO..." : "CRIAR CONTA"}
                    </button>

                    {err && <p style={{ color: "tomato", marginTop: 8 }}>{err}</p>}
                    {ok && <p style={{ color: "seagreen", marginTop: 8 }}>{ok}</p>}
                </form>

                <div className="separator">ou se inscreva com</div>

                <div className="social-login">
                    <button className="social-btn google-btn" type="button">
                        <img
                            src="https://img.icons8.com/color/48/000000/google-logo.png"
                            alt="Google"
                        />
                    </button>
                    <button className="social-btn apple-btn" type="button">
                        <img
                            src="https://img.icons8.com/sf-regular-filled/48/000000/apple.png"
                            alt="Apple"
                        />
                    </button>
                    <button className="social-btn facebook-btn" type="button">
                        <img
                            src="https://img.icons8.com/color/48/000000/facebook-new.png"
                            alt="Facebook"
                        />
                    </button>
                </div>

                <p className="login-link">
                    Já possui uma conta? <a href="/login">Faça o LOGIN</a>
                </p>
            </div>

            <div className="rodapé-cadastro">
                <p>© 2025 pecacerta.com | Design by Gabriel de Mendonça</p>
            </div>
        </div>
    );
}

export default Cadastro;
