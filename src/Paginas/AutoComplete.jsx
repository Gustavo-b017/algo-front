import React from 'react';

function AutoComplete({ sugestoes, mostrarSugestoes, carregandoSugestoes, setQuery, setMostrarSugestoes, buscarTratados }) {
  const handleSelect = (s) => {
    setQuery(s);
    setMostrarSugestoes(false);
    buscarTratados(1); // Buscar novamente página 1 ao selecionar sugestão
  };

  return (
    <div className="position-relative">
      {mostrarSugestoes && (
        <ul className="list-group position-absolute w-25 z-3 mt-1" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {carregandoSugestoes ? (
            <li className="list-group-item text-center">Carregando...</li>
          ) : (
            sugestoes.map((s, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelect(s)}
              >
                {s}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default AutoComplete;