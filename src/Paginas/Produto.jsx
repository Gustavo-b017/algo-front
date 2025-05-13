import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Item from './Item';
import Sugestoes from './Sugestoes';
import axios from 'axios';
import '../Estilosao/produto.css';
import Entregas from './Entregas';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://127.0.0.1:5000';

function Produto() {
  const location = useLocation();
  const produto = location.state?.produto;
  const [produtoOk, setProdutoOk] = useState(false);

  useEffect(() => {
    async function carregarProduto() {
      if (!produto) return;
      try {
        await axios.get(`${API_URL}/produto?id=${produto.id}&codigoReferencia=${encodeURIComponent(produto.codigoReferencia)}&nomeProduto=${encodeURIComponent(produto.nome)}`);
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
    <div className="container">
      {produtoOk && (
        <>
          <Item />

          <hr />

          <Sugestoes />

          <hr />

          <Entregas />
        </>
      )}
    </div>
  );
}

export default Produto;
