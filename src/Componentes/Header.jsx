// src/Componentes/Header.jsx
// ============================================================================
// Componente: Header
// ----------------------------------------------------------------------------
// Objetivo
// - Fornecer a barra superior (branding, busca e ações) e o menu lateral
//   responsivo (categorias, links institucionais e conta do usuário).
//
// Diretrizes e alinhamento arquitetural (coerentes com o back):
// - Responsabilidade única: componente de apresentação e orquestração de UI.
//   Não executa regra de negócio; integra-se ao contexto de autenticação (useAuth)
//   apenas para exibir estado (usuário/logado, contador do carrinho) e acionar
//   logout quando solicitado.
// - Acessibilidade: uso de textos alternativos em imagens (alt), rótulos claros,
//   botões com `aria-label`, estados de expansão com `aria-expanded` no menu
//   lateral (accordions) e foco em semântica de navegação.
// - Performance/Manutenção: estado local mínimo (abertura de menus). Estilos
//   isolados em `/public/style/*.scss`. Imagens/ícones versionados em `/public`.
// - Interoperabilidade front/back: contador do carrinho e saudação dependem do
//   contexto de autenticação preenchido por chamadas ao back (token/JWT) fora
//   deste componente. O Header não conhece contratos HTTP; apenas consome os
//   dados já resolvidos via `useAuth`.
// - Navegação SPA: links internos usam `<Link>` do react-router-dom. Links
//   externos também podem usar `<Link>` com URLs absolutas (preservado conforme
//   o projeto), mas, se preferir nova aba/comportamento distinto, ajuste no
//   markup conforme necessidade futura.
// ============================================================================

import React, { useState } from "react";
import "/public/style/header.scss";
import "/public/style/sideMenu.scss";

import logo from "/public/imagens/logo_ancora.svg";
import menu_icon from "/public/imagens/icones/menu.png";
import user_icon from "/public/imagens/icones/user.svg";
import user_avatar_placeholder from "/public/imagens/icones/userPlaceholder.png";
import carrinho_icon from "/public/imagens/icones/carrinho.svg";
import Pesquisa from "./Pesquisa.jsx";
import instagram from "/public/imagens/icones/instagram.png";
import facebook from "/public/imagens/icones/facebook.png";
import linkeding from "/public/imagens/icones/linkeding.png";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

// Lista fixa de categorias exibidas no menu lateral.
// Mantém-se estática aqui para simplicidade; caso necessário, receber por props
// ou via contexto para torná-la dinâmica.
const category_list = [
    { name: "Cambio", id: 1 },
    { name: "Engrenagem", id: 2 },
    { name: "Disco", id: 3 },
    { name: "Pastilha", id: 4 },
    { name: "Amortecedor", id: 5 },
    { name: "Vela", id: 6 },
    { name: "Diferencial", id: 7 },
    { name: "Filtro", id: 8 },
    { name: "Oleo", id: 9 },
    { name: "Combustível", id: 10 }
];

// Links institucionais exibidos no accordion “Sobre” do menu lateral.
// URLs absolutas (externas) e relativas (internas) são preservadas.
const info_links = [
    { name: "Rede Ancora", href: "https://www.redeancora.com.br/" },
    { name: "Quem somos?", href: "https://portifolio-g3.vercel.app/" },
    { name: "Suporte", href: "/suporte" }
];

function Header({ query, setQuery, placa, setPlaca, dropdownRef, onSearchSubmit }) {

    // Dados de autenticação e carrinho disponibilizados pelo contexto global.
    const { user, logout, ready, cartItemCount } = useAuth();

    // Estados locais apenas de UI (não persistentes / não globais).
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // Abre/fecha o container do menu lateral.
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Fecha o menu e sub-áreas (usado por backdrop e navegação).
    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsCategoriesOpen(false);
    };

    // Encaminha logout e fecha o menu (UX previsível).
    const handleLogout = () => {
        closeMenu();
        logout();
    };

    // Abre/fecha a lista de categorias (accordion).
    const toggleCategories = () => {
        setIsCategoriesOpen(!isCategoriesOpen);
    };

    // Abre/fecha o bloco “Sobre” (accordion).
    const toggleInfo = () => {
        setIsInfoOpen(!isInfoOpen);
    };

    return (
        <>
            <div className="header">
                {/* Bloco de menu + logomarca (lado esquerdo) */}
                <div className="header-menu">

                    {/* Botão hamburger para menu lateral (mobile/desktop) */}
                    <button type="button" className="menu-btn" aria-label="Abrir menu" onClick={toggleMenu}>
                        <img src={menu_icon} alt="Menu" />
                    </button>

                    {/* Logotipo (link para a Home) */}
                    <Link to="/" className="logo" aria-label="Página inicial">
                        <img src={logo} className="img-logo" alt="Rede Ancora - Logo" />
                    </Link>
                </div>

                {/* Área central: componente de busca (inclui autocomplete e placa) */}
                <div className="header-busca">
                    <Pesquisa
                        query={query}
                        setQuery={setQuery}
                        placa={placa}
                        setPlaca={setPlaca}
                        dropdownRef={dropdownRef}
                        onSearchSubmit={onSearchSubmit}
                    />
                </div>

                {/* Ações do usuário: login/perfil e carrinho com badge de contagem */}
                <div className="header-actions">
                    {ready && (
                        user ? (
                            <div className="user-box">

                                {/* Saudação e botão de sair */}
                                <div className="user-text">
                                    <span>Olá, {user.nome?.split(" ")[0] || "Minha conta"}</span>
                                    <button type="button" onClick={logout} className="user-logout-btn">Sair</button>
                                </div>

                                {/* Avatar (fallback para ícone padrão) com navegação para Perfil */}
                                <Link to="/perfil" className="user-link" title="Minha conta">
                                    <img
                                        src={user.avatar_url || user_avatar_placeholder}
                                        alt="Meu Perfil"
                                        className="user-avatar-icon"
                                        onError={(e) => { e.target.onerror = null; e.target.src = user_icon; }}
                                    />
                                </Link>
                            </div>
                        ) : (
                            // Link para autenticação quando não logado
                            <Link to="/login" className="cadastro-btn">
                                <span>Entre /{"\n"}Cadastro </span>

                                <img
                                    src={user_icon}
                                    alt="Entrar ou Cadastrar"
                                    aria-hidden="true"
                                    className="user-avatar-icon"
                                />
                            </Link>
                        )
                    )}

                    {/* Carrinho com badge: valor exibido vem do contexto (cartItemCount) */}
                    <Link to="/carrinho" className="carrinho-btn" title="Abrir carrinho">
                        <img src={carrinho_icon} alt="Carrinho" />
                        {/* Badge condicional para não poluir quando estiver zero */}
                        {cartItemCount > 0 && (
                            <span className="carrinho-badge">{cartItemCount}</span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Backdrop: ao clicar fora, fecha o menu lateral (melhor UX em mobile) */}
            <div
                className={`menu-backdrop ${isMenuOpen ? 'open' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            ></div>

            {/* Menu lateral (drawer): navegação condensada + accordions */}
            <div className={`side-menu-container ${isMenuOpen ? 'open' : ''}`}>
                <div className="side-menu-header">
                    <h3>Menu</h3>
                </div>

                <nav className="side-menu-nav">
                    {/* Entrada de conta (condicional) */}
                    {user ? (
                        <Link to="/perfil" onClick={closeMenu}>Minha Conta</Link>
                    ) : (
                        <Link to="/login" onClick={closeMenu}>Entrar / Cadastrar</Link>
                    )}

                    <hr className="menu-divider" />

                    {/* Accordion: Categorias (busca por termo pré-preenchido) */}
                    <button
                        className={`menu-subtitle-toggle ${isCategoriesOpen ? 'active' : ''}`}
                        onClick={toggleCategories}
                        aria-expanded={isCategoriesOpen} // melhora leitura por leitores de tela
                    >
                        Categorias
                    </button>
                    <div className={`side-menu-accordion-content ${isCategoriesOpen ? 'open' : ''}`}>
                        {category_list.map((category) => (
                            <Link
                                key={category.id}
                                to={`/resultados?termo=${category.name}`}
                                onClick={closeMenu}
                                className="menu-category-link"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    {/* Accordion: Sobre (links institucionais) */}
                    <hr className="menu-divider" />

                    <button
                        className={`menu-subtitle-toggle ${isInfoOpen ? 'active' : ''}`}
                        onClick={toggleInfo}
                        aria-expanded={isInfoOpen}
                    >
                        Sobre
                    </button>

                    <div className={`side-menu-accordion-content ${isInfoOpen ? 'open' : ''}`}>
                        {info_links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={closeMenu}
                                className="menu-category-link"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                </nav>

                {/* Rodapé do drawer: ações e redes sociais */}
                <div className="side-menu-footer">

                    {user && (
                        <>
                            <hr className="menu-divider" />
                            {/* Ação de logout no contexto do menu, mantendo consistência de UX */}
                            <button className="menu-action-btn logout" onClick={handleLogout}>
                                Sair
                            </button>
                        </>
                    )}

                    {/* Ícones sociais: referências externas (mantidas) */}
                    <div className="side-menu-social">
                        <a href="https://www.linkedin.com/company/redeancorabr/" aria-label="LinkedIn"><img src={linkeding} alt="LinkedIn" /></a>
                        <a href="https://www.facebook.com/RedeAncora/" aria-label="Facebook"><img src={facebook} alt="Facebook" /></a>
                        <a href="https://www.instagram.com/redeancorabr" aria-label="Instagram"><img src={instagram} alt="Instagram" /></a>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Header;
