// src/Paginas/Produto.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Item from '../Componentes/Item';
import Sugestoes from '../Componentes/Sugestoes';
import Header from '../Componentes/Header';
import ProdutoDestaque from '../Componentes/ProdutoDestaque';
import Footer from '../Componentes/Footer';
import Avaliacoes from '../Componentes/avaliacoes';
import { useAuth } from '../contexts/auth-context';

function Produto() {
  const [searchParams] = useSearchParams();
  const [dadosCompletos, setDadosCompletos] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const { fetchCartCount } = useAuth(); // NOVO: Consumir fetchCartCount

  const salvarProduto = async (dadosDoItem) => {
    try {
      // Requisição agora usa a instância 'api' que injeta o token
      const res = await api.post('/salvar_produto', dadosDoItem);

      fetchCartCount(); // NOVO: Sincroniza o contador no cabeçalho
      alert(res.data.message);
      
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      // O interceptor em api.js já redireciona para /login em caso de 401
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
      // CORREÇÃO: Exige apenas o 'id' para fazer a busca, tornando a lógica mais flexível
      if (!id) {
        setErro('ID do produto não especificado na URL.');
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro(null); // Limpa erros anteriores

      try {
        const params = new URLSearchParams({ id });
        // Adiciona o nome do produto aos parâmetros APENAS se ele existir na URL
        if (nomeProduto) {
          params.set('nomeProduto', nomeProduto);
        }

        // Requisição agora usa a instância 'api' que já tem o timeout e baseURL
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
      <div className="loader-container" style={{ height: '100vh' }}>
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

  // Renderização segura caso dadosCompletos ou item ainda seja nulo
  if (!dadosCompletos || !dadosCompletos.item) {
    return (
      <div className="empty-state-container">
        <h1>Produto não encontrado.</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />

      <Item dadosItem={dadosCompletos.item} onSave={salvarProduto} />

      {/* <Sugestoes
        dadosSimilares={dadosCompletos.similares}
        onSugestaoClick={handleSugestaoClick}
      /> */}

      <ProdutoDestaque produtoDestaque={dadosCompletos.item.nomeProduto} handleLinhaClick={handleLinhaClick} />
      <Avaliacoes />
      <Footer />
    </div>
  );
}

export default Produto;