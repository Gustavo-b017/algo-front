import React, { useEffect, useState, useRef } from 'react';
import '/public/style/campos.css';

// Componente para os seletores customizados
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
            <div
                className="custom-select-selected"
                onClick={() => setOpen(!open)}
            >
                {selectedLabel}
            </div>
            <ul className="custom-select-options">
                {options.map((opt, i) => (
                    <li
                        key={i}
                        className={opt.value === value ? 'selected' : ''}
                        onClick={() => {
                            onChange(opt.value);
                            setOpen(false);
                        }}
                    >
                        {opt.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Pesquisa({
    query, setQuery,
    placa, setPlaca,
    sugestoes = [],
    mostrarSugestoes = false,
    carregandoSugestoes = false,
    setMostrarSugestoes,
    dropdownRef,
    onSearchSubmit // Adicione a nova prop
}) {
    const handleSelect = (sugestao) => {
        setQuery(sugestao);
        setMostrarSugestoes(false);
        onSearchSubmit(sugestao, placa); // Chama a função de busca com a sugestão
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
                        {carregandoSugestoes ? <li className="loading">Carregando...</li>
                            : sugestoes.length > 0 ? (
                                sugestoes.map((s, i) => (
                                    <li key={i} className="sugestao">
                                        <button type="button" onClick={() => handleSelect(s)}>
                                            {s} 
                                        </button>
                                    </li>
                                ))
                            ) : <li className="loading">Nenhuma sugestão.</li>
                        }
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
            {/* Botão de submissão oculto, para permitir o envio do formulário com a tecla 'Enter' */}
            <button type="submit" style={{ display: 'none' }}></button>
        </form>
    );
}

export default Pesquisa;