// src/Paginas/Produto.jsx

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Item from './Item';
import Sugestoes from './Sugestoes';
import axios from 'axios';
import '../Estilosao/produto.css';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://127.0.0.1:5000';

function Produto() {
  const [searchParams] = useSearchParams();
  const [dadosCompletos, setDadosCompletos] = useState(null); // Estado para guardar TODA a resposta
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const id = searchParams.get('id');
    const nomeProduto = searchParams.get('nomeProduto');

    async function carregarDetalhes() {
      if (!id || !nomeProduto) {
        setErro('Parâmetros inválidos para carregar o produto.');
        setCarregando(false);
        return;
      }
      try {
        const params = new URLSearchParams({ id, nomeProduto });
        // Chamamos a nossa nova e eficiente rota!
        const res = await axios.get(`${API_URL}/produto_detalhes?${params.toString()}`);
        setDadosCompletos(res.data); // Guardamos a resposta completa no estado
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
          {/* Passamos os dados do item via props */}
          <Item dadosItem={dadosCompletos.item} />
          <hr />
          {/* Passamos os dados dos similares via props */}
          <Sugestoes dadosSimilares={dadosCompletos.similares} />
        </>
      )}
    </div>
  );
}

export default Produto;