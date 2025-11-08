// src/Paginas/Produto.jsx
// -----------------------------------------------------------------------------
// Página de Detalhe do Produto
// Responsabilidades principais:
// - Ler parâmetros de rota (?id e opcionalmente ?nomeProduto) e buscar detalhes.
// - Exibir o produto (componente <Item />) e blocos auxiliares (destaques/avaliações).
// - Adicionar item ao carrinho (via API autenticada) e exibir notificação.
// - Propagar atualização do contador de carrinho no Header via contexto (useAuth).
//
// Convenções e integração:
// - As chamadas HTTP usam `api` (instância Axios centralizada) que injeta o
//   token JWT do usuário e já trata 401 (ex.: redirecionamento para /login).
// - `salvarProduto` adiciona o item ao carrinho pela rota POST /salvar_produto.
// - `handleQuickAdd` é usado nos destaques para um “adicionar rápido” com
//   montagem do payload local, reaproveitando a função `cartAdd`.
// - A notificação visual usa <CartNotification /> e recebe o item adicionado.
//
// Parâmetros de rota esperados:
// - id (obrigatório)   -> usado como chave principal para recuperar detalhes
// - nomeProduto (opcional) -> repassado apenas para refinar request
//
// Estados locais:
// - dadosCompletos: resposta do backend { item, similares }.
// - erro / carregando: controle de fluxo para tela de loading e mensagens.
// - notification: controla a visibilidade e dados do toast de carrinho.
//
// Observações de manutenção:
// - Mantida a estrutura original. Apenas comentários descritivos foram inseridos.
// - O bloco <Sugestoes /> permanece comentado como no original.
// - Em caso de evolução, padronizar payloads entre `salvarProduto` e `handleQuickAdd`.
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/auth-context';

import Item from '../Componentes/Item';
import Sugestoes from '../Componentes/Sugestoes';
import Header from '../Componentes/Header';
import ProdutoDestaque from '../Componentes/ProdutoDestaque';
import Footer from '../Componentes/Footer';
import Avaliacoes from '../Componentes/avaliacoes';
import { cartAdd } from "../lib/api";

import CartNotification from '../Componentes/CartNotification';
import "/public/style/cartNotification.scss";

function Produto() {
  const [searchParams] = useSearchParams();
  const [dadosCompletos, setDadosCompletos] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const { user, fetchCartCount } = useAuth();

  const [notification, setNotification] = useState({
    isVisible: false,
    data: null,
  });

  /**
   * Adiciona o produto ao carrinho usando a rota autenticada do backend.
   * - Usa `api.post('/salvar_produto')`, que já inclui JWT via interceptor.
   * - Atualiza o contador global de carrinho (Header) e mostra notificação.
   */
  const salvarProduto = async (dadosDoItem) => {
    try {
      // Requisição agora usa a instância 'api' que injeta o token
      const res = await api.post('/salvar_produto', dadosDoItem);

      fetchCartCount();

      // ALERT: Ativa a notificação personalizada
      setNotification({
        isVisible: true,
        // Passa os dados COMPLETOs do item para o pop-up
        data: dadosDoItem
      });

    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      // O interceptor em api.js já redireciona para /login em caso de 401
      if (error.response?.status !== 401) {
        alert("Erro ao salvar o produto. Verifique o console.");
      }
    }
  };

  // const handleSugestaoClick = (produto) => {
  //   const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
  //   navigate(`/produto?${params.toString()}`);
  // };

  /**
   * Navega para outra página de produto, preservando o padrão de querystring.
   * Usado pelos destaques/sugestões.
   */
  const handleLinhaClick = (produto) => {
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  /**
   * Adição rápida ao carrinho a partir do bloco de destaque.
   * - Exige usuário autenticado; caso contrário, direciona ao login.
   * - Monta payload consistente com o que o backend espera em /salvar_produto.
   */
  const handleQuickAdd = async (produto) => {
    if (!user) {
      alert("Você precisa fazer login para adicionar itens ao carrinho.");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    const itemToAdd = {
      id_api_externa: produto.id,
      nome: produto.nome,
      codigo_referencia: produto.codigoReferencia || produto.id,
      url_imagem: produto.imagemReal,
      preco_original: produto.precoOriginal,
      preco_final: produto.preco,
      desconto: produto.descontoPercentual,
      marca: produto.marca,
      quantidade: 1
    };

    try {
      await cartAdd(itemToAdd);
      fetchCartCount();

      setNotification({
        isVisible: true,
        data: { ...itemToAdd, nomeProduto: itemToAdd.nome }
      });

    } catch (error) {
      console.error("Erro ao adicionar item rápido:", error);
      alert("Não foi possível adicionar o item. Tente novamente.");
    }
  };

  /**
   * Efeito de carregamento:
   * - Exige `id` na URL; `nomeProduto` é opcional e apenas refina o request.
   * - Busca os detalhes usando GET /produto_detalhes?id=...&nomeProduto=...
   * - Controle de loading/erro para feedback de UI.
   */
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

  // Tela de carregamento integral
  if (carregando) {
    return (
      <div className="loader-container" style={{ height: '100vh' }}>
        <div className="loader-circle"></div>
        <p className="notive_load">Carregando...</p>
      </div>
    );
  }

  // Estado de erro (ex.: id ausente ou falha na API)
  if (erro) {
    return (
      <div className="empty-state-container">
        <h1>{erro}</h1>
      </div>
    );
  }

  // Guarda extra para evitar acesso a propriedades indefinidas
  if (!dadosCompletos || !dadosCompletos.item) {
    return (
      <div className="empty-state-container">
        <h1>Produto não encontrado.</h1>
      </div>
    );
  }

  // Encapsula a chamada de salvar para manter a assinatura esperada pelo <Item />
  const handleAddClick = (data) => {
        salvarProduto(data);
  };

  return (
    <div className="container">
      <Header />

      {/* Componente principal que renderiza o card detalhado do produto */}
      <Item dadosItem={dadosCompletos.item} onSave={salvarProduto} />

      {/* Listagem de itens semelhantes/ofertas complementares (mantida comentada) */}
      {/* <Sugestoes
        dadosSimilares={dadosCompletos.similares}
        onSugestaoClick={handleSugestaoClick}
      /> */}

      {/* Bloco de destaques relacionado ao produto atual,
          com suporte a navegação por linha e adição rápida ao carrinho */}
      <ProdutoDestaque 
        produtoDestaque={dadosCompletos.item.nomeProduto} 
        handleLinhaClick={handleLinhaClick} 
        handleQuickAdd={handleQuickAdd} 
      />

      {/* Seção de avaliações mock/demonstrativas */}
      <Avaliacoes />

      <Footer />

      {/* Toast de confirmação de item adicionado ao carrinho */}
      <CartNotification
        isVisible={notification.isVisible}
        onClose={() => setNotification(v => ({ ...v, isVisible: false }))}
        productData={notification.data}
      />

    </div>
  );
}

export default Produto;
