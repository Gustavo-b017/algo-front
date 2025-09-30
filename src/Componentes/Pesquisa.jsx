// src/Componentes/Pesquisa.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '/public/style/campos.scss';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Pesquisa({ query: queryProp, setQuery: setQueryProp, placa: placaProp, setPlaca: setPlacaProp, dropdownRef: dropdownRefProp, onSearchSubmit }) {
    // controlado pelo pai? (senão, usa fallback interno)
    const controlledQuery = typeof queryProp !== 'undefined' && typeof setQueryProp === 'function';
    const controlledPlaca = typeof placaProp !== 'undefined' && typeof setPlacaProp === 'function';

    const [queryInt, setQueryInt] = useState(queryProp ?? '');
    const [placaInt, setPlacaInt] = useState(placaProp ?? '');
    const query = controlledQuery ? queryProp : queryInt;
    const setQuery = controlledQuery ? setQueryProp : setQueryInt;
    const placa = controlledPlaca ? placaProp : placaInt;
    const setPlaca = controlledPlaca ? setPlacaProp : setPlacaInt;

    const localRef = useRef(null);
    const dropdownRef = dropdownRefProp || localRef;

    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

    // fecha lista ao clicar fora
    useEffect(() => {
        const handle = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setMostrarSugestoes(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [dropdownRef]);

    // autocomplete com debounce
    useEffect(() => {
        if (!query) { setSugestoes([]); return; }
        const t = setTimeout(() => {
            setCarregandoSugestoes(true);
            axios.get(`${API_URL}/autocomplete`, { params: { prefix: query } })
                .then(r => setSugestoes(r.data?.sugestoes || []))
                .catch(() => setSugestoes([]))
                .finally(() => setCarregandoSugestoes(false));
        }, 300);
        return () => clearTimeout(t);
    }, [query]);

    const submit = (termo, placaVal) => {
        if (typeof onSearchSubmit === 'function') onSearchSubmit(termo, placaVal);
    };

    const handleSubmit = (e) => { e.preventDefault(); submit(query, placa); };
    const handleSelect = (s) => { setQuery(s); setMostrarSugestoes(false); submit(s, placa); };

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
