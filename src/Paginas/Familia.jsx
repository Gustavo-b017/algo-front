// src/Paginas/Familia.jsx
import React from 'react';

function Familia({ listaFamilias, montadoraId, valorSelecionado, onChange, carregando }) {
  if (!montadoraId) {
    return null;
  }

  return (
    <div className="campo-familia" style={{ marginBottom: '20px', maxWidth: '90vw', margin: '0 auto 20px auto' }}>
      <select
        className="custom-select-selected"
        value={valorSelecionado}
        onChange={(e) => onChange(e.target.value)}
        disabled={carregando}
        style={{ width: '100%', border: '3px solid #022e4c' }}
      >
        <option value="">
          {carregando ? 'Carregando categorias...' : '2. Selecione a Categoria'}
        </option>
        {listaFamilias.map(familia => (
          <option key={familia.id} value={familia.id}>
            {familia.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Familia;