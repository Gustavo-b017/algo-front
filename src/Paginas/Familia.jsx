// src/Paginas/Familia.jsx
import React from 'react';

function Familia({ listaFamilias, montadoraId, valorSelecionadoId, onChange, carregando }) {
  if (!montadoraId) return null;

  const handleChange = (e) => {
    const id = e.target.value;
    const nome = e.target.options[e.target.selectedIndex].text;
    onChange(id, nome);
  };

  return (
    <div className="campo-familia" style={{ marginBottom: '20px', maxWidth: '90vw', margin: '0 auto 20px auto' }}>
      <select
        className="custom-select-selected"
        value={valorSelecionadoId}
        onChange={handleChange}
        disabled={carregando}
        style={{ width: '100%', border: '3px solid #022e4c' }}
      >
        <option value="">{carregando ? 'Carregando...' : '2. Selecione a Categoria'}</option>
        {listaFamilias.map(familia => (
          <option key={familia.id} value={familia.id}>{familia.nome}</option>
        ))}
      </select>
    </div>
  );
}

export default Familia;