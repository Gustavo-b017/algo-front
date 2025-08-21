// src/Paginas/Montadora.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

function Montadora({ valorSelecionado, onChange }) {
  const [montadoras, setMontadoras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Busca a lista de montadoras assim que o componente é montado
    axios.get(`${API_URL}/montadoras`)
      .then(res => {
        setMontadoras(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar montadoras:", err);
        // Em caso de erro, podemos limpar a lista para não mostrar nada quebrado
        setMontadoras([]); 
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    <div className="campo-montadora" style={{ marginBottom: '20px', maxWidth: '90vw', margin: '0 auto 20px auto' }}>
      <select
        className="custom-select-selected" // Reutilizando o estilo que já temos
        value={valorSelecionado}
        onChange={(e) => onChange(e.target.value)}
        disabled={carregando}
        style={{ width: '100%', border: '3px solid #ce0f2d' }} // Um destaque em vermelho
      >
        <option value="">
          {carregando ? 'Carregando...' : '1. Selecione a Montadora'}
        </option>
        {montadoras.map(montadora => (
          <option key={montadora.id} value={montadora.id}>
            {montadora.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Montadora;