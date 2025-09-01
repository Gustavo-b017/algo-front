import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/public/style/FiltroLateral.css';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function FiltroLateral({ onFilterChange }) {
  const [montadoras, setMontadoras] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [subFamilias, setSubFamilias] = useState([]);
  const [selectedMontadora, setSelectedMontadora] = useState('');
  const [selectedFamilia, setSelectedFamilia] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/montadoras`).then(res => setMontadoras(res.data));
    axios.get(`${API_URL}/familias`).then(res => setFamilias(res.data));
  }, []);

  useEffect(() => {
    if (selectedFamilia) {
      // Aqui você deve implementar a chamada para buscar as subfamílias
      // com base na família selecionada. Ex:
      // axios.get(`${API_URL}/subfamilias?familiaId=${selectedFamilia}`)
      //   .then(res => setSubFamilias(res.data));
    }
  }, [selectedFamilia]);

  const handleMontadoraChange = (e) => {
    setSelectedMontadora(e.target.value);
    onFilterChange({ montadora: e.target.value, familia: selectedFamilia });
  };

  const handleFamiliaChange = (e) => {
    setSelectedFamilia(e.target.value);
    onFilterChange({ montadora: selectedMontadora, familia: e.target.value });
  };

  return (
    <div className="filtro-lateral">
      <h4>Filtros</h4>
      <div className="filtro-grupo">
        <label>Montadora</label>
        <select onChange={handleMontadoraChange} value={selectedMontadora}>
          <option value="">Todas</option>
          {montadoras.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
        </select>
      </div>
      <div className="filtro-grupo">
        <label>Família</label>
        <select onChange={handleFamiliaChange} value={selectedFamilia}>
          <option value="">Todas</option>
          {familias.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>
      </div>
      {/* Adicionar a lógica para sub-famílias aqui */}
    </div>
  );
}

export default FiltroLateral;