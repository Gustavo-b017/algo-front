// src/Paginas/Campos.jsx

import React, { useRef } from 'react';
import '../Estilosao/campos.css';

// Componente para os seletores customizados
function CustomSelect({ options, value, onChange, placeholder }) {
  // ... (O código do CustomSelect pode ser o mesmo que você já tinha)
  return (
    <select className="custom-select-selected" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

function Campos({
  query, setQuery,
  placa, setPlaca,
  marcas = [],
  marcaSelecionada, setMarcaSelecionada,
  ordem, setOrdem,
  sugestoes = [],
  mostrarSugestoes = false,
  carregandoSugestoes = false,
  setMostrarSugestoes,
}) {
  const dropdownRef = useRef(null);

  const handleSelect = (sugestao) => {
    setQuery(sugestao);
    if (setMostrarSugestoes) {
      setMostrarSugestoes(false);
    }
  };

  // Prepara as opções para os seletores
  const marcaOptions = marcas.map(m => ({ value: m, label: m }));
  const ordemOptions = [
    { value: 'asc', label: 'Crescente' },
    { value: 'desc', label: 'Decrescente' }
  ];

  return (
    <div className="campos-grid" style={{width: '90vw', margin: '0 auto'}}>
      <div className="busca">
        {/* Campo de busca por produto com autocomplete */}
        <div className="campo-busca" ref={dropdownRef}>
          <input
            type="text"
            className="campo-input"
            placeholder="Buscar por nome do produto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setMostrarSugestoes && setMostrarSugestoes(true)}
          />
          {mostrarSugestoes && query && (
            <ul className="sugestoes-list">
              {carregandoSugestoes ? <li className="loading">Carregando...</li>
                : sugestoes.length > 0 ? (
                  sugestoes.map((s, i) => (
                    <li key={i} className="sugestao" onClick={() => handleSelect(s)}>
                      <button type="button">{s}</button>
                    </li>
                  ))
                ) : <li className="loading">Nenhuma sugestão.</li>
              }
            </ul>
          )}
        </div>
        {/* Campo de Placa */}
        <div className="campo-placa">
            <input
                type="text"
                className="campo-input"
                placeholder="Placa (opcional)"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            />
        </div>
      </div>
      <div className="filtros">
        {/* Seletor de Marcas */}
        <div className="campo-marcas">
            <CustomSelect
                options={marcaOptions}
                value={marcaSelecionada}
                onChange={setMarcaSelecionada}
                placeholder="Todas as Marcas"
            />
        </div>
        {/* Seletor de Ordem */}
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

export default Campos;