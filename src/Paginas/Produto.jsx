// src/Paginas/Produto.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// 1. Remova a importação direta do axios
// import axios from 'axios'; 
// 2. Importe a sua instância configurada 'api'
import { api } from '../lib/api'; 
import Item from '../Componentes/Item';
import Sugestoes from '../Componentes/Sugestoes';
import Header from '../Componentes/Header';
import Categorias from '../Componentes/Categorias';
import ProdutoDestaque from '../Componentes/ProdutoDestaque';
import Footer from '../Componentes/Footer';
import Avaliacoes from '../Componentes/avaliacoes';

function Produto() {
  const [searchParams] = useSearchParams();
  const [dadosCompletos, setDadosCompletos] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  const salvarProduto = async (dadosDoItem) => {
    try {
      // 3. Use 'api.post' em vez de 'axios.post' e remova a URL base
      const res = await api.post('/salvar_produto', dadosDoItem);
      alert(res.data.message);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      // O interceptor em api.js já vai lidar com o redirecionamento em caso de 401
      if (error.response?.status !== 401) {
        alert("Erro ao salvar o produto. Verifique o console.");
      }
    }
  };

  const handleSugestaoClick = (produto) => {
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  const handleLinhaClick = (produto) => {
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
      setCarregando(true);
      try {
        const params = new URLSearchParams({ id, nomeProduto });
        // 4. Use 'api.get' para consistência
        const res = await api.get(`/produto_detalhes?${params.toString()}`);
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
      {dadosCompletos && (
        <>
          <Item dadosItem={dadosCompletos.item} onSave={salvarProduto} />

          <Sugestoes
            dadosSimilares={dadosCompletos.similares}
            onSugestaoClick={handleSugestaoClick} // Passe a nova prop
          />

        </>
      )}

      <hr />

      <ProdutoDestaque produtoDestaque={dadosCompletos.item.nomeProduto} handleLinhaClick={handleLinhaClick} />
      <Avaliacoes />
      <Footer />
    </div>
  );
}

export default Produto;