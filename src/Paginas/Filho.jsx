import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Estilosao/item.css';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Filho() {
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarFilhos() {
      try {
        // Chamada para a API /componentes-filhos
        const res = await axios.get(`${API_URL}/componentes-filhos`);
        console.log("📦 Dados recebidos de /componentes-filhos:", res.data);
        setDados(res.data);
      } catch (error) {
        console.error('Erro ao carregar componentes filhos:', error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregarFilhos();
  }, []);

  if (carregando) {
    return <div className="text-center mt-5"><h1>Carregando componentes filhos...</h1></div>;
  }

  if (erro || !Array.isArray(dados) || dados.length === 0) {
    return null;
  }

  return (
    <div className="item-aplicacoes">
      <h2 className="secao-titulo">Componentes Filhos</h2>

      <div className="aplicacoes-scroll-limitada">
        <div className="aplicacoes-grid">
          {dados.map((filho, index) => (
            <div key={filho.id || index} className="aplicacao-card">
              <div className="aplicacao-header">
                <p><strong>{filho.nomeProduto}</strong></p>
                <p>Ref: {filho.codigoReferencia}</p>
                <p>Marca: {filho.marca}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Filho;
