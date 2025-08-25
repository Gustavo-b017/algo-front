// src/Paginas/Campos.jsx

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

function Filtro({
    query, setQuery,
    placa, setPlaca,
    marcas = [],
    marcaSelecionada, setMarcaSelecionada,
    ordem, setOrdem,
    sugestoes = [],
    mostrarSugestoes = false,
    carregandoSugestoes = false,
    setMostrarSugestoes,
    dropdownRef
}) {
    const handleSelect = (sugestao) => {
        setQuery(sugestao);
        setMostrarSugestoes(false);
    };

    const marcaOptions = marcas.map(m => ({ value: m, label: m }));
    const ordemOptions = [
        { value: 'asc', label: 'Crescente' },
        { value: 'desc', label: 'Decrescente' }
    ];

    return (
        <div className="campos-grid" style={{ width: '90vw', margin: '0 auto' }}>
            <div className="filtros">
                <div className="campo-marcas">
                    <CustomSelect
                        options={marcaOptions}
                        value={marcaSelecionada}
                        onChange={setMarcaSelecionada}
                        placeholder="Todas as Marcas"
                    />
                </div>
                <div className="campo-ordem">
                    <CustomSelect
                        options={ordemOptions}
                        value={ordem}
                        onChange={setOrdem}
                        placeholder="Ordem"
                    />
                </div>
            </div>
        </div>
    );
}

export default Filtro;