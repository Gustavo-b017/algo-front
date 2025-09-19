import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/public/style/campos.scss';

const API_URL = import.meta.env.VITE_API_URL;
//const API_URL = 'http://127.0.0.1:5000'; 

function CustomSelect({ options, value, onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
        <div className={`custom-select${open ? ' open' : ''}`} ref={ref}>
            <div className="custom-select-selected" onClick={() => setOpen(!open)}>
                {selectedLabel}
            </div>
            <ul className="custom-select-options">
                {options.map((opt, i) => (
                    <li
                        key={i}
                        className={opt.value === value ? 'selected' : ''}
                        onClick={() => { onChange(opt.value); setOpen(false); }}
                    >
                        {opt.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Pesquisa() {
    const [query, setQuery] = useState('');
    const [placa, setPlaca] = useState('DME8I14');
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Debounce + chamada do autocomplete centralizados aqui
    useEffect(() => {
        if (!query) {
            setSugestoes([]);
            setMostrarSugestoes(false);
            return;
        }
        const timer = setTimeout(() => {
            setCarregandoSugestoes(true);
            axios.get(`${API_URL}/autocomplete?prefix=${encodeURIComponent(query)}`)
                .then(res => setSugestoes(res.data?.sugestoes || []))
                .catch(() => setSugestoes([]))
                .finally(() => setCarregandoSugestoes(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Submeter busca: termo e/ou placa
    const onSearchSubmit = (termo, placaValor) => {
        const params = new URLSearchParams({});
        if (termo) params.set('termo', termo);
        if (placaValor) params.set('placa', placaValor.toUpperCase());
        if ([...params.keys()].length) {
            navigate(`/resultados?${params.toString()}`);
        }
    };

    const handleSelect = (sugestao) => {
        setQuery(sugestao);
        setMostrarSugestoes(false);
        onSearchSubmit(sugestao, placa);
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
                    onClick={() => setMostrarSugestoes(!mostrarSugestoes)}
                >
                    {mostrarSugestoes ? '✕' : '☰'}
                </button>
                {mostrarSugestoes && query && (
                    <ul className="sugestoes-list">
                        {carregandoSugestoes ? (
                            <li className="loading">Carregando...</li>
                        ) : sugestoes.length > 0 ? (
                            sugestoes.map((s, i) => (
                                <li key={i} className="sugestao">
                                    <button type="button" onClick={() => handleSelect(s)}>
                                        {s}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="loading">Nenhuma sugestão.</li>
                        )}
                    </ul>
                )}
            </div>

            {/* Campo de PLACA integrado ao mesmo componente */}
            <div className="campo-placa">
                <input
                    type="text"
                    className="campo-input"
                    placeholder="Placa (opcional)"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                />
            </div>

            {/* Botão oculto só para submit via Enter */}
            <button type="submit" style={{ display: 'none' }}></button>
        </form>
    );
}

export default Pesquisa;
