import React, { useEffect } from 'react';

function Campos({ query, setQuery, marcas, marcaSelecionada, setMarcaSelecionada, ordem, setOrdem, dropdownRef, toggleSugestoes, sugestoes, mostrarSugestoes, carregandoSugestoes, setMostrarSugestoes, buscarTratados }) {
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
    <>
      <div className="col-lg-3 col-md-6 position-relative" ref={dropdownRef}>
        <div className="position-relative">
          <input
            type="text"
            className="form-control pe-5"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => toggleSugestoes()}
          />
          <button
            className="btn btn-sm position-absolute end-0 top-0 mt-1 me-2 bg-transparent border-0"
            title="Alternar sugestões"
            onClick={toggleSugestoes}
          >
            &#9776;
          </button>
        </div>

        {mostrarSugestoes && (
          <ul className="list-group position-absolute w-100 z-3 mt-1" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {carregandoSugestoes ? (
              <li className="list-group-item text-center">Carregando...</li>
            ) : (
              sugestoes.map((s, i) => (
                <li key={i} className="list-group-item p-0">
                  <button
                    type="button"
                    className="list-group-item list-group-item-action w-100 text-start"
                    onClick={() => handleSelect(s)}
                    style={{ border: 'none', background: 'transparent' }}
                  >
                    {s}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={marcaSelecionada}
          onChange={(e) => setMarcaSelecionada(e.target.value)}
        >
          <option value="">Todas as Marcas</option>
          {marcas.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
        >
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
      </div>
    </>
  );
}

export default Campos;
