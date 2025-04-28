import React from 'react';

function AutoComplete({ sugestoes, mostrarSugestoes, carregandoSugestoes, setQuery, setMostrarSugestoes, buscarTratados }) {
  const handleSelect = (s) => {
    console.log('🚀 Selecionado no AutoComplete:', s); // feedback atualizado
    setQuery(s);
    setMostrarSugestoes(false);
    buscarTratados(1);
  };

  return (
    <div className="position-relative">
      {mostrarSugestoes && (
        <ul className="list-group position-absolute w-25 z-3 mt-1" style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
  );
}

export default AutoComplete;
