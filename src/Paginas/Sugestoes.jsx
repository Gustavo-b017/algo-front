import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Estilosao/sugestao.css';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://127.0.0.1:5000';

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
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (carregando) {
    return <div className="text-center mt-5"><h1>Carregando sugestões...</h1></div>;
  }

  if (erro || !dados || (dados.similares.length === 0 && dados.produtosParcialmenteSimilares.length === 0)) {
    return null;
  }

  const similares = dados.similares || [];
  const parciais = dados.produtosParcialmenteSimilares || [];

  return (
    <div className="sugestoes-container">
      {similares.length > 0 && (
        <div className="sugestoes-bloco">
          <h2 className="secao-titulo">Produtos Similares</h2>
          <div className="aplicacoes-scroll-limitada">
            <div className="aplicacoes-grid">
              {similares.map((produto, index) => (
                <div key={index} className="aplicacao-card">
                  <div className="aplicacao-header">
                    <p><strong>Ref:</strong> {produto.codigoReferencia}</p>
                    <p><strong>Marca:</strong> {produto.marca}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {parciais.length > 0 && (
        <div className="sugestoes-bloco">
          <h2 className="secao-titulo">Produtos Parcialmente Similares</h2>
          <div className="aplicacoes-scroll-limitada">
            <div className="aplicacoes-grid">
              {parciais.map((produto, index) => (
                <div key={index} className="aplicacao-card">
                  <div className="aplicacao-header">
                    <p>{produto.nomeProduto}</p>
                    <p><strong>Marca:</strong> {produto.marca}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sugestoes;
