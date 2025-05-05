import React, { useState, useEffect } from 'react';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Distancia() {
  const [loja, setLoja] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarLoja = async () => {
      try {
        const res = await fetch(`${API_URL}/lojas`);
        if (!res.ok) throw new Error('Erro ao carregar loja mais próxima');
        const json = await res.json();
        setLoja(json.loja_mais_proxima);
      } catch (err) {
        setErro(err.message);
      }
    };

    carregarLoja();
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '600px' }}>
      <h3>Loja Mais Próxima</h3>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {loja && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>{loja.loja}</strong></p>
          <p>{loja.endereco}</p>
          <p><em>{loja.distancia_km} km de distância</em></p>
        </div>
      )}
    </div>
  );
}

export default Distancia;