import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Estilosao/item.css';
import Distancia from './Distancia';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Item() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null); // <- Controle do hover

  useEffect(() => {
    async function carregarItem() {
      try {
        const res = await axios.get(`${API_URL}/item`);
        setDados(res.data);
      } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregarItem();
  }, []);

  if (carregando) {
    return <div className="text-center mt-5"><h1>Carregando...</h1></div>;
  }

  if (erro) {
    return <div className="text-center mt-5"><h2>Erro ao carregar detalhes do produto.</h2></div>;
  }

  return (
    <div className="item-container">
      <div className="item-topo">
        <div className="item-imagem">
          <img src={dados.imagemReal} alt={dados.nomeProduto} />
        </div>

        <div className="item-info">
          <h1 className="item-nome">{dados.nomeProduto}</h1>
          <p className="item-marca">Marca: <strong>{dados.marca}</strong></p>
          <p className="item-ref">Família: <strong>{dados.familia.descricao}</strong></p>
          <p className="item-ref">Referência OEM: <strong>{dados.familia?.subFamiliaDescricao}</strong></p>
        </div>

        <Distancia />
        
      </div>

      <div className="item-aplicacoes">
        <h2 className="secao-titulo">Modelos Compatíveis</h2>

        <div className="aplicacoes-scroll-limitada">
          <div className="aplicacoes-grid">
            {dados.aplicacoes.map((aplicacao, index) => (
              <div
                key={aplicacao.id || index}
                className={`aplicacao-card ${hoverIndex === index ? 'ativo' : ''}`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="aplicacao-header">
                  <p><strong>{aplicacao.modelo}</strong> - {aplicacao.versao}</p>
                  <p>{aplicacao.carroceria} | {aplicacao.montadora}</p>
                </div>

                {hoverIndex === index && (
                  <div className="aplicacao-detalhes">
                    <hr />
                    <p><strong>Motor:</strong> {aplicacao.motor}</p>
                    <p><strong>Combustível:</strong> {aplicacao.combustivel}</p>
                    <p><strong>Potência:</strong> {aplicacao.hp}</p>
                    <p><strong>Cilindros:</strong> {aplicacao.cilindros}</p>
                    <p><strong>Linha:</strong> {aplicacao.linha}</p>
                    <p><strong>Início:</strong> {aplicacao.fabricacaoInicial}</p>
                    <p><strong>Fim:</strong> {aplicacao.fabricacaoFinal}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>

  );
}

export default Item;
