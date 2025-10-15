// src/Componentes/Pesquisa.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/public/style/campos.scss';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://127.0.0.1:5000';


function Pesquisa() {
    const [query, setQuery] = useState('');
    const [placa, setPlaca] = useState('DME8I14');
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!query) {
            setSugestoes([]);
            setMostrarSugestoes(false);
            return;
        }
        const t = setTimeout(() => {
            setCarregandoSugestoes(true);
            axios
                .get(`${API_URL}/autocomplete`, { params: { prefix: query } })
                .then(res => setSugestoes(res.data?.sugestoes || []))
                .catch(() => setSugestoes([]))
                .finally(() => setCarregandoSugestoes(false));
        }, 300);
        return () => clearTimeout(t);
    }, [query]);

    const onSearchSubmit = (termo, placaValor) => {
        const params = new URLSearchParams();
        if (termo) params.set('termo', termo);
        if (placaValor) params.set('placa', placaValor.toUpperCase());
        if ([...params.keys()].length) {
            navigate(`/resultados?${params.toString()}`);
        }
    };

    const handleSelect = (s) => {
        setQuery(s);
        setMostrarSugestoes(false);
        onSearchSubmit(s, placa);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearchSubmit(query, placa);
    };

    return (
        <form className="busca" onSubmit={handleSubmit}>
            <div className="campo-busca" ref={dropdownRef}>
                <input
                    type="text"
                    className="campo-input"
                    placeholder="Buscar por nome do produto..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setMostrarSugestoes(true)}
                />
                <button
                    type="button"
                    className={`toggle-btn ${mostrarSugestoes ? 'aberto' : ''}`}
                    title="Alternar sugestões"
                    onClick={() => setMostrarSugestoes(v => !v)}
                >
                    {mostrarSugestoes ? '✕' : '☰'}
                </button>
                {mostrarSugestoes && query && (
                    <ul className="sugestoes-list">
                        {carregandoSugestoes ? (
                            <li className="loading">Carregando...</li>
                        ) : sugestoes.length ? (
                            sugestoes.map((s, i) => (
                                <li key={i} className="sugestao">
                                    <button type="button" onClick={() => handleSelect(s)}>{s}</button>
                                </li>
                            ))
                        ) : (
                            <li className="loading">Nenhuma sugestão.</li>
                        )}
                    </ul>
                )}
            </div>

            <div className="campo-placa">
                <input
                    type="text"
                    className="campo-input"
                    placeholder="Placa (opcional)"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                />
            </div>

            <button type="submit" style={{ display: 'none' }} />
        </form>
    );
}

export default Pesquisa;
