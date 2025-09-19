// src/Paginas/Produto.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Item from './Item';
import Sugestoes from './Sugestoes';
import axios from 'axios';
import Header from '../Componentes/Header';
import Categorias from '../Componentes/Categorias'
import ProdutoDestaque from '../Componentes/ProdutoDestaque'
import Footer from '../Componentes/Footer';
import Avaliacoes from '../Componentes/avaliacoes';

const API_URL = import.meta.env.VITE_API_URL;
//const API_URL = 'http://127.0.0.1:5000';

function Produto() {
  const [searchParams] = useSearchParams();
  const [dadosCompletos, setDadosCompletos] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate(); // Inicialize o hook de navegação

  const salvarProduto = async (dadosDoItem) => {
    try {
      const res = await axios.post(`${API_URL}/salvar_produto`, dadosDoItem);
      alert(res.data.message);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar o produto. Verifique o console.");
    }
  };

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
    return (
      <div className="loader-container" style={{
        height: '100vh'
      }}>
        <div className="loader-circle"></div>
        <p className="notive_load">Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="empty-state-container">
        <h1>{erro}</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <Categorias />
      {dadosCompletos && (
        <>
          <Item dadosItem={dadosCompletos.item} onSave={salvarProduto} />
          <hr />

          <Sugestoes
            dadosSimilares={dadosCompletos.similares}
            onSugestaoClick={handleSugestaoClick} // Passe a nova prop
          />
        </>
      )}
      <ProdutoDestaque />
      <Avaliacoes/>
      <Footer/>
    </div>
  );
}

export default Produto;