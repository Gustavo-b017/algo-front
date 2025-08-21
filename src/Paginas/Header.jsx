// src/Paginas/Header.jsx

import React from "react";
import "../Estilosao/header.css"; 

import logo from "../imagens/logo_ancora.svg";
import menu_icon from "../imagens/menu_icon.png";

import Campos from "./Campos.jsx";
import Cascata from "./Cascata.jsx";


function Header({
    // Props para o Campos.jsx
    query, setQuery, placa, setPlaca, marcas, marcaSelecionada,
    setMarcaSelecionada, ordem, setOrdem, sugestoes, mostrarSugestoes,
    carregandoSugestoes, setMostrarSugestoes, dropdownRef,
    // Props para o Cascata.jsx
    listaMontadoras, montadoraSelecionada, handleMontadoraChange, carregandoCascata,
    listaFamilias, familiaSelecionada, handleFamiliaChange
}) {
    return (
        <header className="header">
            <div className="header-menu">
                <button className="menu-btn"><img src={menu_icon} alt={"Menu"}/></button>
            </div>
            <div className="logo"><img src={logo} alt={"Rede Ancora - Logo"}/></div>
            
            <div className="header-busca-container">
                <h4 style={{ textAlign: 'center', margin: '20px 0', color: 'black' }}>Busca por Texto</h4>
                
                <Campos
                    query={query} setQuery={setQuery}
                    placa={placa} setPlaca={setPlaca}
                    marcas={marcas}
                    marcaSelecionada={marcaSelecionada} setMarcaSelecionada={setMarcaSelecionada}
                    ordem={ordem} setOrdem={setOrdem}
                    sugestoes={sugestoes}
                    mostrarSugestoes={mostrarSugestoes} setMostrarSugestoes={setMostrarSugestoes}
                    carregandoSugestoes={carregandoSugestoes}
                    dropdownRef={dropdownRef}
                />
                <Cascata
                    listaMontadoras={listaMontadoras}
                    montadoraSelecionada={montadoraSelecionada}
                    handleMontadoraChange={handleMontadoraChange}
                    carregandoCascata={carregandoCascata}
                    listaFamilias={listaFamilias}
                    familiaSelecionada={familiaSelecionada}
                    handleFamiliaChange={handleFamiliaChange}
                />
                
                <hr style={{ margin: '30px auto', borderColor: 'black' }} />
            </div>

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