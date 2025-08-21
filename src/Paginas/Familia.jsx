// src/Paginas/Familia.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

function Familia({ montadoraId, valorSelecionado, onChange }) {
  const [familias, setFamilias] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    // Se nenhuma montadora foi selecionada, não faz nada
    if (!montadoraId) {
      setFamilias([]);
      return;
    }

    setCarregando(true);
    
    axios.get(`${API_URL}/familias`)
      .then(res => {
        setFamilias(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar famílias:", err);
        setFamilias([]);
      })
      .finally(() => {
        setCarregando(false);
      });
  // Roda este efeito sempre que uma nova montadora é selecionada
  }, [montadoraId]);

  // Só mostra o seletor se uma montadora já foi escolhida
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
        style={{ width: '100%', border: '3px solid #022e4c' }} // Destaque em azul
      >
        <option value="">
          {carregando ? 'Carregando categorias...' : '2. Selecione a Categoria da Peça'}
        </option>
        {familias.map(familia => (
          <option key={familia.id} value={familia.id}>
            {familia.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Familia;