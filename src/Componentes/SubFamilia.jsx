import React from 'react';

function SubFamilia({ listaSubFamilias, valorSelecionadoId, onChange, carregando, familiaId }) {
  if (!familiaId) return null;

  const handleChange = (e) => {
    const id = e.target.value;
    const nome = e.target.options[e.target.selectedIndex].text;
    onChange(id, nome);
  };

  const hasSubFamilias = listaSubFamilias.length > 0;

  return (
    <div className="campo-subfamilia" style={{ marginBottom: '20px', maxWidth: '90vw', margin: '0 auto 20px auto' }}>
      <select
        className="custom-select-selected"
        value={valorSelecionadoId}
        onChange={handleChange}
        disabled={carregando || !hasSubFamilias}
        style={{ width: '100%', border: '3px solid #f2a900' }}
      >
        {/* Lógica de texto atualizada */}
        <option value="">
          {carregando ? 'Carregando...' : (hasSubFamilias ? '3. Refinar por Subfamília (Opcional)' : 'Nenhuma subfamília disponível')}
        </option>
        {listaSubFamilias.map(sub => (
          <option key={sub.id} value={sub.id}>{sub.nome}</option>
        ))}
      </select>
    </div>
  );
}

export default SubFamilia;