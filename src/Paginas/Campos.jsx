import React, { useEffect } from 'react';

function Campos({ query, setQuery, marcas, marcaSelecionada, setMarcaSelecionada, ordem, setOrdem, dropdownRef, toggleSugestoes }) {
  useEffect(() => {
    console.log('Query recebida no Campos:', query); // ← feedback 3
  }, [query]);
  
  return (
    <>
      <div className="col-lg-3 col-md-6" ref={dropdownRef}>
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
