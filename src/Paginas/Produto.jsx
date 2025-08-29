// Produto.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Importe useNavigate
import Item from './Item';
import Sugestoes from './Sugestoes';
import axios from 'axios';
import '/public/style/produto.css';

const API_URL = import.meta.env.VITE_API_URL;

function Produto() {
  const [searchParams] = useSearchParams();
  const [dadosCompletos, setDadosCompletos] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate(); // Inicialize o hook de navegação

  const handleSugestaoClick = (produto) => {
    // Redireciona para a mesma página, mas com novos parâmetros
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  useEffect(() => {
    const id = searchParams.get('id');
    const nomeProduto = searchParams.get('nomeProduto');

    async function carregarDetalhes() {
      if (!id || !nomeProduto) {
        setErro('Parâmetros inválidos para carregar o produto.');
        setCarregando(false);
        return;
      }
      setCarregando(true); // Reinicia o estado de carregamento para o novo produto
      try {
        const params = new URLSearchParams({ id, nomeProduto });
        const res = await axios.get(`${API_URL}/produto_detalhes?${params.toString()}`);
        setDadosCompletos(res.data);
      } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        setErro('Não foi possível carregar os detalhes do produto.');
      } finally {
        setCarregando(false);
      }
    }

    carregarDetalhes();
  }, [searchParams]);

  if (carregando) {
    return <div className="text-center mt-5"><h1>Carregando produto...</h1></div>;
  }

  if (erro) {
    return <div className="container mt-5 text-center"><h2>{erro}</h2></div>;
  }

  return (
    <div className="container">
      {dadosCompletos && (
        <>
          <Item dadosItem={dadosCompletos.item} />
          <hr />
          <Sugestoes
            dadosSimilares={dadosCompletos.similares}
            onSugestaoClick={handleSugestaoClick} // Passe a nova prop
          />
        </>
      )}
    </div>
  );
}

export default Produto;