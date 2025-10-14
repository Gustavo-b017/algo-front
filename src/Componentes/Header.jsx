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
            <div className="header-menu">
                <button className="menu-btn"><img src={menu_icon} alt={"Menu"} /></button>

                <div className="logo" onClick={() => window.location.href = "/"}>
                    <img src={logo} alt={"Rede Ancora - Logo"} />
                </div>
            </div>

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

            <div className="header-actions">
                {ready && (
                    user ? (
                        <div className="user-box" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <Link to="/perfil" className="user-link" title="Minha conta">
                                {/* Mostra nome/primeiro nome; ajuste ao seu gosto */}
                                {user.nome?.split(" ")[0] || "Minha conta"}
                            </Link>
                            <button onClick={logout} className="user-logout-btn">Sair</button>
                        </div>
                    ) : (
                        <Link to="/login" className="user-link">Entre/Cadastro</Link>
                    )
                )}
                <button onClick={() => window.location.href = "/carrinho"} ><img src={carrinho_icon} alt={"Carrinho icon"} className="carrinho-btn" /><span>Carrinho</span></button>
            </div>
        </div>
    );
}

export default Header;
