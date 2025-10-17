// src/Componentes/Header.jsx
import React from "react";
import "/public/style/header.scss";

import logo from "/public/imagens/logo_ancora.svg";
import menu_icon from "/public/imagens/icones/menu.png";
import user_icon from "/public/imagens/icones/user.svg";
import carrinho_icon from "/public/imagens/icones/carrinho.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import Pesquisa from "./Pesquisa.jsx";

function Header({ query, setQuery, placa, setPlaca, dropdownRef, onSearchSubmit }) {
    const { user, logout, ready } = useAuth();

    return (
        <div className="header">
            {/* Menu (toggle futuro) */}
            <div className="header-menu">

                <button type="button" className="menu-btn" aria-label="Abrir menu">
                    <img src={menu_icon} alt="Menu" />
                </button>

                {/* Logo como irmão direto (mais previsível para o CSS e acessível) */}
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
                </Link>
            </div>
        </div>
    );
}

export default Header;
