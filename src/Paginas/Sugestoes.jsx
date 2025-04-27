import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Sugestoes() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/similares`);
        setDados(res.data);
      } catch (error) {
        console.error('Erro ao carregar sugestões:', error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }, 500); // delay de 500ms antes de buscar

    return () => clearTimeout(timer);
  }, []);

  if (carregando) {
    return <div className="text-center mt-5"><h1>Carregando sugestões...</h1></div>;
  }

  if (erro || !dados || (dados.similares.length === 0 && dados.produtosParcialmenteSimilares.length === 0)) {
    return <div className="text-center mt-5"><h2>Sem sugestões visíveis.</h2></div>;
  }

  const dadosParciais  = dados.produtosParcialmenteSimilares;

  return (
    <div className="card p-4 mb-4">
      <h3>Sugestões</h3>
      {/* <p>Modelo: {dadosParciais[0]?.nomeProduto}</p> */}
      {dadosParciais.length > 0 && (
        <ul>
          {dados.produtosParcialmenteSimilares.map((produto, index) => (
            <div>
              <li key={index}>{produto.nomeProduto}</li>
              <li key={index}>{produto.marca}</li>
            </div>
          ))}
        </ul>
      )}
      <p>filhos: {dados.produtosSistemasFilhos} </p>
    </div>
  );
}

export default Sugestoes;
