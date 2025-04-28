import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Item() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(true);

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
    <div className="card p-4 mb-4 item">
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
        <h1 className="modeloTitulo">
          Carros em que essa peça se aplica
        </h1>

        <div className="modeloItem">
          <h2>Modelo</h2>
          <div className="modeloCarro">
            <p>Carro: {dadosApli[0]?.carroceria}</p>
            <p>Modelo: {dadosApli[0]?.modelo}</p>
            <p>Montadora: {dadosApli[0]?.montadora}</p>
            <p>Versão: {dadosApli[0]?.versao}</p>
          </div>

          <h2>Dados técnicos</h2>
          <div className="modeloTeacnico">
            <p>Motor: {dadosApli[0]?.motor}</p>
            <p>Combustível: {dadosApli[0]?.combustivel}</p>
            <p>Potência: {dadosApli[0]?.hp}</p>
            <p>Cilindrada: {dadosApli[0]?.cilindros}</p>
            <p>Linha: {dadosApli[0]?.linha}</p>
            <p>Inicio da fabricação: {dadosApli[0]?.fabricacaoInicial}</p>
            <p>Fim da Fabricação: {dadosApli[0]?.fabricacaoFinal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;