import React, { useEffect } from 'react';
import '../Estilosao/campos.css';

function Campos({
  query,
  setQuery,
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
  useEffect(() => {
    console.log('Query recebida no Campos:', query);
  }, [query]);

  const handleSelect = (s) => {
    console.log('🚀 Selecionado no AutoComplete:', s);
    setQuery(s);
    setMostrarSugestoes(false);
    buscarTratados(1);
  };

  return (
    <div className="campos-grid">

      <div className="busca">

        <div className="campo-busca" ref={dropdownRef}>
          <input
            type="text"
            className="campo-input"
            placeholder="Buscar..."
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
                    <button
                      type="button"
                      onClick={() => handleSelect(s)}
                    >
                      {s}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="marca-opcao">

        <div className="campo-marcas">
          <select
            className="select-input"
            value={marcaSelecionada}
            onChange={(e) => setMarcaSelecionada(e.target.value)}
          >
            <option value="">Todas as Marcas</option>
            {marcas.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="campo-ordem">
          <select
            className="select-input"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>
    </div>


  );
}

export default Campos;
