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

  return (
    <div className="card p-4 mb-4">
      <h2>{dados.nomeProduto}</h2>
      <p>Marca: {dados.marca}</p>
    </div>
  );
}

export default Item;