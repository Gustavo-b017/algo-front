import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Item from './Item';
import Sugestoes from './Sugestoes';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Produto() {
  const location = useLocation();
  const produto = location.state?.produto;
  const [produtoOk, setProdutoOk] = useState(false);

  useEffect(() => {
    async function carregarProduto() {
      if (!produto) return;
      try {
        await axios.get(`${API_URL}/produto?codigoReferencia=${produto.codigoReferencia}&nomeProduto=${produto.nome}`);
        setProdutoOk(true);
      } catch (error) {
        console.error('Erro ao chamar o componente Produto:', error);
        alert('Erro ao chamar o componente Produto.');
      }
    }
    setProdutoOk(false);
    carregarProduto();
  }, [produto]);

  if (!produto) {
    return <div className="container mt-5">Produto não encontrado.</div>;
  }

  return (
    <div className="container mt-5">
      {produtoOk && (
        <>
          <Item />
          <Sugestoes />
        </>
      )}
    </div>
  );
}

export default Produto;
