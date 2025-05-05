import React, { useState, useEffect } from 'react';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Entregas() {
  const [rota, setRota] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarRota = async () => {
      try {
        const res = await fetch(`${API_URL}/rota-entrega`);
        if (!res.ok) throw new Error('Erro ao calcular rota de entregas');
        const json = await res.json();
        setRota(json);
      } catch (err) {
        setErro(err.message);
      }
    };

    carregarRota();
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '700px' }}>
      <h3>Rota de Entregas</h3>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {rota && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Origem:</strong> {rota.origem.nome}</p>
          <p><em>Endereço:</em> Loja Brigadeiro</p>
          <hr />
          <h4>Oficinas visitadas na ordem:</h4>
          <ol>
            {rota.rota.map((oficina, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <strong>{oficina.nome}</strong><br />
                {oficina.endereco}
              </li>
            ))}
          </ol>
          <hr />
          <p><strong>Distância total:</strong> {rota.distancia_total_km} km</p>
        </div>
      )}
    </div>
  );
}

export default Entregas;
