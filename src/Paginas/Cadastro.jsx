// Cadastro.jsx
// -----------------------------------------------------------------------------
// Tela de criação de conta do usuário.
// Responsabilidades:
// - Exibir formulário de cadastro (nome, e-mail, senha) com validações básicas.
// - Requisitar a criação de conta via API (authRegister).
// - Fornecer feedback de sucesso/erro e redirecionar para /login após cadastro.
// - Aplicar boas práticas de acessibilidade (labels, aria-*), UX (show/hide senha)
//   e estados de carregamento (disabled).
//
// Manutenção e orientação para novos desenvolvedores:
// - A validação é deliberadamente simples (regex de e-mail, tamanho mínimo de senha,
//   aceite de termos). Regras mais rígidas devem ser implementadas também no back-end.
// - O fluxo de cadastro depende de authRegister (../lib/api). Em caso de refatoração
//   da API, alinhar o contrato de resposta { success, error }.
// - O redirecionamento após sucesso ocorre com pequeno delay (setTimeout 800ms)
//   para permitir leitura da mensagem "Conta criada!".
// - Componentes de social login são placeholders visuais. Integrações reais exigem
//   fluxos OAuth/OpenID Connect no back-end.
// - Estilos vêm de /public/style/cadastro.scss; mantenha nomes de classe para não
//   quebrar o layout.
//
// Possíveis evoluções (não implementadas para preservar o original):
// - Força de senha (medidor), política de complexidade e dicas.
// - Validação assíncrona de e-mail já cadastrado (throttle/debounce).
// - Tratamento de erros por código (ex.: 409 e-mail já existente).
// - Telemetria de erros e UX (ex.: Sentry).
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "/public/style/cadastro.scss";
import logo from "/public/imagens/logo_ancora.svg";
import { authRegister } from "../lib/api";

function Cadastro() {
    // Estados controlados do formulário
    const [primeiroNome, setPrimeiroNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [aceitouTermos, setAceitouTermos] = useState(false);

    // Estados de UI/feedback
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    /**
     * Validação mínima de campos do formulário.
     * Retorna string com mensagem de erro ou string vazia ("") se estiver tudo ok.
     */
    function validarCampos() {
        if (!primeiroNome.trim()) return "Informe seu nome.";
        const em = email.trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(em)) return "Endereço de e-mail inválido.";
        if (senha.length < 3) return "A senha deve ter pelo menos 3 caracteres.";
        if (!aceitouTermos) return "Você precisa aceitar os termos de uso.";
        return "";
    }

    /**
     * Handler do submit:
     * - Cancela o comportamento padrão do form.
     * - Valida campos locais e exibe mensagem de erro, se houver.
     * - Chama a API de cadastro e trata as respostas { success, error }.
     * - Em caso de sucesso, mostra feedback e redireciona para /login.
     */
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
                // Delay curto para o usuário ler o feedback antes do redirect
                setTimeout(() => navigate("/login"), 800);
            } else {
                setErr(res?.error || "Falha ao cadastrar.");
            }
        } catch (e) {
            // Em produção, prefira mapear códigos de status/erros conhecidos
            setErr(e?.message || "Erro de rede.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="cadastro-page-container">
            {/* Elemento decorativo de background */}
            <div className="background-azul" aria-hidden="true"></div>

            {/* Cabeçalho com logo navegável */}
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

            {/* Card/formulário principal com regiões acessíveis */}
            <div className="cadastro-form-card" role="region" aria-labelledby="titulo-cadastro">
                <div className="card-header">
                    <h2 id="titulo-cadastro">Crie uma conta</h2>
                    <p>Maneira simples e rápida de continuar suas compras</p>
                </div>

                {/* Formulário controlado; noValidate para manter validação customizada */}
                <form className="cadastro-form" onSubmit={onSubmit} noValidate>
                    {/* Nome */}
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

                    {/* E-mail */}
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
                            placeholder="convidado@gmail.com"
                        />
                    </div>

                    {/* Senha + toggle visibilidade (sem dependências externas) */}
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
                                {/* Ícones SVG embutidos para alternar visibilidade */}
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

                    {/* Aceite de termos (gate para envio) */}
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

                    {/* CTA principal; fica desabilitado durante envio ou sem aceite de termos */}
                    <button
                        type="submit"
                        className="create-account-btn"
                        disabled={loading || !aceitouTermos}
                    >
                        {loading ? "ENVIANDO..." : "CRIAR CONTA"}
                    </button>

                    {/* Container de feedback: renderiza apenas se houver mensagem */}
                    {(err || ok) && (
                        <div className="form-feedback" aria-live="polite" aria-atomic="true">
                            {err && <p className="msg error">{err}</p>}
                            {ok && <p className="msg success">{ok}</p>}
                        </div>
                    )}
                </form>

                {/* Separador semântico e opções de social login (placeholders) */}
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

                {/* Link para usuários já registrados */}
                <p className="login-link">
                    Já possui uma conta? <Link to="/login">Faça o LOGIN</Link>
                </p>
            </div>

            {/* Rodapé simples com informação institucional */}
            <div className="rodape-cadastro" role="contentinfo">
                <p>© 2025 pecacerta.com | Projeto by G³ </p>
            </div>
        </div>
    );
}

export default Cadastro;
