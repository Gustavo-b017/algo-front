// src/Componentes/Header.jsx
import React, { useState } from "react";
import "/public/style/header.scss";
import "/public/style/sideMenu.scss";

import logo from "/public/imagens/logo_ancora.svg";
import menu_icon from "/public/imagens/icones/menu.png";
import user_icon from "/public/imagens/icones/user.svg";
import carrinho_icon from "/public/imagens/icones/carrinho.svg";
import Pesquisa from "./Pesquisa.jsx";
import instagram from "/public/imagens/icones/instagram.png";
import facebook from "/public/imagens/icones/facebook.png";
import linkeding from "/public/imagens/icones/linkeding.png";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

const category_list = [
    { name: "Cambio", id: 1 },
    { name: "Motor", id: 2 },
    { name: "Disco", id: 3 },
    { name: "Pastilha", id: 4 },
    { name: "Filtro", id: 5 },
    { name: "Parafuso", id: 6 },
    { name: "Oleo", id: 7 },
    { name: "Valvula", id: 8 },
    { name: "Radiador", id: 9 },
    { name: "Embreagem", id: 10 }
];

const info_links = [
    { name: "Rede Ancora", href: "https://www.redeancora.com.br/" }, 
    { name: "Quem somos?", href: "https://www.redeancora.com.br/quem_somos/" },
    { name: "Parceiros", href: "https://www.redeancora.com.br/industrias/" },
    { name: "Suporte", href: "#" }
];

function Header({ query, setQuery, placa, setPlaca, dropdownRef, onSearchSubmit }) {

    const { user, logout, ready, cartItemCount } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // Função para abrir/fechar o menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Função para fechar o menu (usada nos links e backdrop)
    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsCategoriesOpen(false);
    };

    // Função de logout (fecha o menu e desloga)
    const handleLogout = () => {
        closeMenu();
        logout();
    };

    const toggleCategories = () => {
        setIsCategoriesOpen(!isCategoriesOpen);
    };

    // Função para o accordion de "Sobre"
    const toggleInfo = () => {
        setIsInfoOpen(!isInfoOpen);
    };

    return (
        <>
            <div className="header">
                {/* Menu (toggle) */}
                <div className="header-menu">

                    <button type="button" className="menu-btn" aria-label="Abrir menu" onClick={toggleMenu}>
                        <img src={menu_icon} alt="Menu" />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="logo" aria-label="Página inicial">
                        <img src={logo} className="img-logo" alt="Rede Ancora - Logo" />
                    </Link>
                </div>

                {/* Busca ocupa a linha inteira no mobile */}
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

                {/* Ações (login/conta + carrinho) */}
                <div className="header-actions">
                    {ready && (
                        user ? (
                            <div className="user-box">

                                <div className="user-text">
                                    <span>Olá, {user.nome?.split(" ")[0] || "Minha conta"}</span>
                                    <button type="button" onClick={logout} className="user-logout-btn">Sair</button>
                                </div>
                                <Link to="/perfil" className="user-link" title="Minha conta">
                                    <img src={user_icon} alt="" aria-hidden="true" className="user-icon" />
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login" className="cadastro-btn">
                                <span>Entre /{"\n"}Cadastro </span>
                                <img src={user_icon} alt="" aria-hidden="true" className="user-icon" />

                            </Link>
                        )
                    )}

                    <Link to="/carrinho" className="carrinho-btn" title="Abrir carrinho">
                        <img src={carrinho_icon} alt="Carrinho" />
                        {/* NOVO: Renderiza o badge se houver itens no carrinho */}
                        {cartItemCount > 0 && (
                            <span className="carrinho-badge">{cartItemCount}</span>
                        )}
                    </Link>
                </div>
            </div>
            {/* Backdrop (fundo escuro) */}
            <div
                className={`menu-backdrop ${isMenuOpen ? 'open' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            ></div>

            {/* Menu Lateral */}
            <div className={`side-menu-container ${isMenuOpen ? 'open' : ''}`}>
                <div className="side-menu-header">
                    <h3>Menu</h3>
                </div>
                
                <nav className="side-menu-nav">
                    {/* Links Condicionais (Minha Conta / Login) */}
                    {user ? (
                        <Link to="/perfil" onClick={closeMenu}>Minha Conta</Link>
                    ) : (
                        <Link to="/login" onClick={closeMenu}>Entrar / Cadastrar</Link>
                    )}
                    
                    <hr className="menu-divider" /> 

                    {/* Bloco de Categorias */}
                    <button 
                        className={`menu-subtitle-toggle ${isCategoriesOpen ? 'active' : ''}`}
                        onClick={toggleCategories}
                        aria-expanded={isCategoriesOpen} // Para acessibilidade
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

                    {/* Bloco Institucional (Accordion 2) */}
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

                {/* Footer do Menu (Mídias Sociais e Botão Sair) */}
                <div className="side-menu-footer">

                     {user && (
                        <>
                            <hr className="menu-divider" />
                            <button className="menu-action-btn logout" onClick={handleLogout}>
                                Sair
                            </button>
                        </>
                    )}
                    
                    {/* NOVO: Links de Mídia Social */}
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
