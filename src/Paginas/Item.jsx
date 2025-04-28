import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Estilosao/item.css';

const API_URL = import.meta.env.VITE_API_URL;

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

  const dadosApli = dados.aplicacoes;

  return (
    <div className="card item">
      <div className="detalhe">
        <div className="detalheImg">
          <img src={dados.imagemReal} alt={dados.nomeProduto} />
        </div>

        <div className="detalheInfos">
          <h2>{dados.nomeProduto}</h2>
          <p>Marca: {dados.marca}</p>
        </div>
      </div>

      <div className="Modelo">
        <h1 className="modeloTitulo">Carros em que essa peça se aplica</h1>

        <div className="modeloItem">
          <h2>Modelos</h2>

          <div className="modeloLista">
            {dadosApli.map((aplicacao, index) => (
              <div
                key={aplicacao.id || index}
                className={`modeloCard ${hoverIndex === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="modeloCarro">
                  <h1>Item: {index}</h1>
                  <p>Carro: {aplicacao.carroceria}</p>
                  <p>Modelo: {aplicacao.modelo}</p>
                  <p>Montadora: {aplicacao.montadora}</p>
                  <p>Versão: {aplicacao.versao}</p>
                </div>

                {hoverIndex === index && (
                  <div className="modeloTecnico">
                    <hr className="divisor" />
                    <h2>Dados técnicos</h2>
                    <p>Motor: {aplicacao.motor}</p>
                    <p>Combustível: {aplicacao.combustivel}</p>
                    <p>Potência: {aplicacao.hp}</p>
                    <p>Cilindrada: {aplicacao.cilindros}</p>
                    <p>Linha: {aplicacao.linha}</p>
                    <p>Início da fabricação: {aplicacao.fabricacaoInicial}</p>
                    <p>Fim da fabricação: {aplicacao.fabricacaoFinal}</p>
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
