import React, { useState, useEffect, useRef } from 'react';
import Header from '../Componentes/Header.jsx';
import Banner from '../Componentes/Banner.jsx';
import Categorias from '../Componentes/Categorias.jsx';
import ProdutoDestaque from '../Componentes/ProdutoDestaque.jsx';
import Marcas from '../Componentes/Marcas.jsx';
import Footer from '../Componentes/Footer.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://127.0.0.1:5000';

function Home() {
    // --- Estados ---
    const [listaMontadoras, setListaMontadoras] = useState([]);
    const [listaFamilias, setListaFamilias] = useState([]);
    const [montadoraSelecionada, setMontadoraSelecionada] = useState({ id: '', nome: '' });
    const [familiaSelecionada, setFamiliaSelecionada] = useState({ id: '', nome: '' });
    const [carregandoCascata, setCarregandoCascata] = useState(true);

    // Estados da Busca por Texto
    const [query, setQuery] = useState('');
    const [placa, setPlaca] = useState('DME8I14');
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

    const dropdownRef = useRef(null);
    const isClearingRef = useRef(false);
    const navigate = useNavigate();

    // --- Funções ---
    const handleSearchSubmit = (termo, placa) => {
        if (termo || placa) {
            const params = new URLSearchParams({ termo, placa });
            navigate(`/resultados?${params.toString()}`);
        }
    };

    // --- Efeitos ---
    useEffect(() => {
        async function carregarDadosCascata() {
            try {
                const [resMontadoras, resFamilias] = await Promise.all([
                    axios.get(`${API_URL}/montadoras`),
                    axios.get(`${API_URL}/familias`)
                ]);
                setListaMontadoras(resMontadoras.data);
                setListaFamilias(resFamilias.data);
            } catch (error) {
                console.error("Erro ao carregar dados da cascata", error);
            } finally {
                setCarregandoCascata(false);
            }
        }
        carregarDadosCascata();
    }, []);

    useEffect(() => {
        if (montadoraSelecionada.id && familiaSelecionada.id) {
            isClearingRef.current = true;
            setQuery('');
            setPlaca('');
        }
    }, [montadoraSelecionada, familiaSelecionada]);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMostrarSugestoes(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Handlers ---
    const handleMontadoraChange = (id, nome) => {
        setMontadoraSelecionada({ id, nome });
        setFamiliaSelecionada({ id: '', nome: '' });
    };

    const handleFamiliaChange = (id, nome) => {
        setFamiliaSelecionada({ id, nome });
    };

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