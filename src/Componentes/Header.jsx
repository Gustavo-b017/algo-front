import React from "react";
import "/public/style/header.scss";

import logo from "/public/imagens/logo_ancora.svg";
import menu_icon from "/public/imagens/icones/menu.png";
import user_icon from "/public/imagens/icones/user.svg";
import carrinho_icon from "/public/imagens/icones/carrinho.svg";

import Pesquisa from "./Pesquisa.jsx";


function Header({
    // Props para o Pesquisa.jsx
    query, setQuery, placa, setPlaca, sugestoes, mostrarSugestoes,
    carregandoSugestoes, setMostrarSugestoes, dropdownRef, onSearchSubmit
}) {
    return (
        <div className="header">

            <div className="header-menu">
                <button className="menu-btn"><img src={menu_icon} alt={"Menu"} /></button>
            </div>

            <div className="logo" onClick={() => window.location.href = "/"}  >
                <img src={logo} alt={"Rede Ancora - Logo"} />
            </div>

            <div className="header-busca">
                <Pesquisa
                    query={query} setQuery={setQuery}
                    placa={placa} setPlaca={setPlaca}
                    sugestoes={sugestoes}
                    mostrarSugestoes={mostrarSugestoes} setMostrarSugestoes={setMostrarSugestoes}
                    carregandoSugestoes={carregandoSugestoes}
                    dropdownRef={dropdownRef}
                    onSearchSubmit={onSearchSubmit} // Passe a nova prop
                />
            </div>

            <div className="header-actions">
                <button><img src={user_icon} alt={"User icon"} className="cadastro-btn" />Entre/Cadastro</button>
                <button><img src={carrinho_icon} alt={"Carrinho icon"} className="carrinho-btn" />Carrinho</button>
            </div>
        </div>
    );
}

export default Header;