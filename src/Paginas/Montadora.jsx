// src/Paginas/Montadora.jsx
import React from 'react';

function Montadora({ listaMontadoras, valorSelecionado, onChange, carregando }) {
  return (
    <div className="campo-montadora" style={{ marginBottom: '20px', maxWidth: '90vw', margin: '0 auto 20px auto' }}>
      <select
        className="custom-select-selected"
        value={valorSelecionado}
        onChange={(e) => onChange(e.target.value, e.target.options[e.target.selectedIndex].text)}
        disabled={carregando}
        style={{ width: '100%', border: '3px solid #ce0f2d' }}
      >
        <option value="">
          {carregando ? 'Carregando...' : '1. Selecione a Montadora'}
        </option>
        {listaMontadoras.map(montadora => (
          <option key={montadora.id} value={montadora.id}>
            {montadora.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Montadora;