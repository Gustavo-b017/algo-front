import React, { useEffect, useState, useRef } from 'react';
import '../Estilosao/campos.css';

function CustomSelect({ options, value, onChange, placeholder = "Selecione uma opção" }) {
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


function Campos({
  query,
  setQuery,
  placa,
  setPlaca,
  marcas,
  marcaSelecionada,
  setMarcaSelecionada,
  ordem,
  setOrdem,
  dropdownRef,
  toggleSugestoes,
  sugestoes,
  mostrarSugestoes,
  carregandoSugestoes,
  setMostrarSugestoes,
  buscarTratados
}) {

  const handleSelect = (s) => {
    setQuery(s);
    setMostrarSugestoes(false);
    buscarTratados(1);
  };

  const marcaOptions = [
    { value: '', label: 'Todas as Marcas' },
    ...marcas.map(m => ({ value: m, label: m }))
  ];
  const ordemOptions = [
    { value: 'asc', label: 'Crescente' },
    { value: 'desc', label: 'Decrescente' }
  ];

  return (
    <div className="campos-grid">

      <div className="busca">
        {/* Campo de busca por produto */}
        <div className="campo-busca" ref={dropdownRef}>
          <input
            type="text"
            className="campo-input"
            placeholder="Buscar por produto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={toggleSugestoes}
          />
          <button
            type="button"
            className={`toggle-btn ${mostrarSugestoes ? 'aberto' : ''}`}
            title="Alternar sugestões"
            onClick={toggleSugestoes}
          >
            {mostrarSugestoes ? '✕' : '☰'}
          </button>

          {mostrarSugestoes && (
            <ul className="sugestoes-list">
              {carregandoSugestoes ? (
                <li className="loading">Carregando...</li>
              ) : (
                sugestoes.map((s, i) => (
                  <li key={i} className="sugestao">
                    <button type="button" onClick={() => handleSelect(s)}>
                      {s}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* --- NOVO CAMPO ADICIONADO AQUI --- */}
        <div className="campo-placa" style={{ minWidth: '180px' }}>
          <input
            type="text"
            className="campo-input"
            placeholder="Placa do veículo"
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          />
        </div>

      </div>

      <div className="filtros">
        <div className="campo-marcas">
          <CustomSelect
            className="select-input"
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

export default Campos;