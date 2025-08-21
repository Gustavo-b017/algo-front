import React from "react";
import "../Estilosao/header.css"; 

import logo from "../Imagens/logo_ancora.svg";
import menu_icon from "../Imagens/menu_icon.png";

import Campos from "./Campos.jsx";


function Header() {
  return (
    <header className="header">
      <div className="header-menu">
        <button className="menu-btn"><img src={menu_icon} alt={"Menu"}/></button>
      </div>
      <div className="logo"><img src={logo} alt={"Rede Ancora - Logo"}/></div>
      <Campos/>
      <div className="header-actions">
        <button className="cadastro-btn">Cadastro</button>
        <button className="carrinho-btn">
          🛒
        </button>
      </div>
    </header>
  );
}

export default Header;