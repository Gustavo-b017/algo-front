// src/Paginas/Home.jsx
import React from 'react';
import Header from '../Componentes/Header.jsx';
import Banner from '../Componentes/Banner.jsx';
import Categorias from '../Componentes/Categorias.jsx';
import ProdutoDestaque from '../Componentes/ProdutoDestaque.jsx';
import Marcas from '../Componentes/Marcas.jsx';
import Footer from '../Componentes/Footer.jsx';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleLinhaClick = (produto) => {
        const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
        navigate(`/produto?${params.toString()}`);
    };

    return (
        <div className="container">
            <Header />
            <Banner />
            <Categorias/>
            <ProdutoDestaque produtoDestaque="disco de freio" handleLinhaClick={handleLinhaClick} />
            <ProdutoDestaque produtoDestaque="filtro de ar" handleLinhaClick={handleLinhaClick} />
            <Marcas />  
            <Footer /> 
        </div>
    );
}

export default Home;
