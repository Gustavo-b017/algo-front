import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Importar o hook
import Item from './Item';
import Sugestoes from './Sugestoes';
import axios from 'axios';
import '../Estilosao/produto.css';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Produto() {
  const [searchParams] = useSearchParams(); // Hook para ler os parâmetros da URL
  const [produtoOk, setProdutoOk] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    // Pega os parâmetros diretamente da URL
    const id = searchParams.get('id');
    const codigoReferencia = searchParams.get('codigoReferencia');
    const nomeProduto = searchParams.get('nomeProduto');

    async function carregarProduto() {
      if (!id || !codigoReferencia || !nomeProduto) {
        setErro('Não foi possível carregar o produto. Parâmetros inválidos.');
        return;
      }
      try {
        const params = new URLSearchParams({ id, codigoReferencia, nomeProduto });
        await axios.get(`${API_URL}/produto?${params.toString()}`);
        setProdutoOk(true);
      } catch (error) {
        console.error('Erro ao chamar o endpoint do produto:', error);
        setErro('Erro ao carregar os detalhes do produto.');
      }
    }
    
    setProdutoOk(false);
    setErro(null);
    carregarProduto();
  }, [searchParams]); // Roda o efeito sempre que a URL mudar

  if (erro) {
    return <div className="container mt-5 text-center"><h2>{erro}</h2></div>;
  }

  return (
    <div className="container">
      {produtoOk ? (
        <>
          <Item />
          <hr />
          <Sugestoes />
        </>
      ) : (
        <div className="text-center mt-5"><h1>Carregando produto...</h1></div>
      )}
    </div>
  );
}

export default Produto;