
import React from "react";

function MarcaSelector({ availableBrands, marcaSelecionada, setMarcaSelecionada }) {
  return (
    <div className="col-md-4">
      <label className="form-label">Marca:</label>
      <select
        className="form-select"
        value={marcaSelecionada}
        onChange={e => setMarcaSelecionada(e.target.value)}
      >
        {availableBrands.length > 0 ? (
          availableBrands.map((m, i) => <option key={i} value={m}>{m}</option>)
        ) : (
          <option disabled>Selecione um produto para ver as marcas</option>
        )}
      </select>
    </div>
  );
}

export default MarcaSelector;
