import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Sugestoes() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/similares`);
        setDados(res.data);
      } catch (error) {
        console.error('Erro ao carregar sugestões:', error);
        setErro(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (erro || !dados || (dados.similares.length === 0 && dados.produtosParcialmenteSimilares.length === 0)) {
    return <div className="text-center mt-4"><p>Sem sugestões visíveis.</p></div>;
  }

  return (
    <div className="card p-4">
      <h3>Sugestões</h3>
    </div>
  );
}

export default Sugestoes;