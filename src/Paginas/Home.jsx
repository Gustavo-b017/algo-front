// src/Paginas/Home.jsx
import React, { useState, useRef, useEffect } from 'react';
import Header from '../Componentes/Header.jsx';
import Banner from '../Componentes/Banner.jsx';
import Categorias from '../Componentes/Categorias.jsx';
import ProdutoDestaque from '../Componentes/ProdutoDestaque.jsx';
import Marcas from '../Componentes/Marcas.jsx';
import Footer from '../Componentes/Footer.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Home() {
    // Estados simplificados apenas para a busca por texto do Header
    const [query, setQuery] = useState('');
    const [placa, setPlaca] = useState('DME8I14');
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Função de busca por texto/placa
    const handleSearchSubmit = (termo, placa) => {
        if (termo || placa) {
            const params = new URLSearchParams({ termo, placa });
            navigate(`/resultados?${params.toString()}`);
        }
    };

    // Efeito para buscar sugestões de autocomplete
    useEffect(() => {
        if (!query) {
            setSugestoes([]);
            setMostrarSugestoes(false);
            return;
        }
        const timer = setTimeout(() => {
            setCarregandoSugestoes(true);
            axios.get(`${API_URL}/autocomplete?prefix=${query}`)
                .then(res => setSugestoes(res.data?.sugestoes || []))
                .catch(() => setSugestoes([]))
                .finally(() => setCarregandoSugestoes(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Handler para o clique em um produto em destaque
    const handleLinhaClick = (produto) => {
        const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
        navigate(`/produto?${params.toString()}`);
    };

    return (
        <div className="container-fluid">
            <Header
                query={query} setQuery={setQuery}
                placa={placa} setPlaca={setPlaca}
                sugestoes={sugestoes}
                mostrarSugestoes={mostrarSugestoes} setMostrarSugestoes={setMostrarSugestoes}
                carregandoSugestoes={carregandoSugestoes}
                dropdownRef={dropdownRef}
                onSearchSubmit={handleSearchSubmit}
            />
            <Banner />
            <Categorias />
            <ProdutoDestaque produtoDestaque="disco de freio" handleLinhaClick={handleLinhaClick} />
            <ProdutoDestaque produtoDestaque="filtro de ar" handleLinhaClick={handleLinhaClick} />
            <Marcas />
            <Footer />
        </div>
    );
}

export default Home;