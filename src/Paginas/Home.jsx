// src/Paginas/Home.jsx
// -----------------------------------------------------------------------------
// Página inicial (Home) — visão geral e orientações de manutenção
//
// Objetivo do arquivo
// - Renderiza a landing com seções-chave: Header, Banner, Categorias, dois blocos
//   de ProdutoDestaque, Marcas, Footer e um componente de notificação (CartNotification).
// - Concentra navegação rápida para resultados por categoria e deep-link para
//   a página de detalhes de um produto.
//
// Fluxo funcional (resumo)
// 1) O usuário acessa a Home e visualiza destaques e categorias.
// 2) Ao clicar em uma categoria, é redirecionado para /resultados com o termo
//    setado na URL (mantém padrão global de busca).
// 3) Em ProdutoDestaque, o usuário pode:
//    - Abrir detalhes do item (handleLinhaClick → /produto?id=...&nomeProduto=...)
//    - Usar o “Quick Add” (handleQuickAdd) para inserir 1 unidade diretamente
//      no carrinho, exigindo autenticação.
// 4) Após “Quick Add”, o contador de itens do carrinho é sincronizado (fetchCartCount)
//    e um toast/cart-notification é exibido.
//
// Estados locais
// - notification: controla exibição e payload do CartNotification.
//   { isVisible: boolean, data: objeto do produto adicionado }
//
// Handlers principais
// - handleLinhaClick(produto): monta querystring com id/nome e navega para /produto.
// - handleCategoryClick(categoryName): navega para /resultados?termo=<categoria>.
// - handleQuickAdd(produto):
//   • Se não autenticado: aciona triggerLoginAlert() do contexto de auth.
//   • Se autenticado: monta o payload esperado pela rota /salvar_produto,
//     chama cartAdd(), atualiza o contador global (fetchCartCount) e exibe a notificação.
//
// Integrações
// - useAuth(): fornece user, fetchCartCount e triggerLoginAlert para fluxos de CRO/UX.
// - cartAdd(): cliente da API que envia o item no formato esperado pelo backend.
// - ProdutoDestaque: recebe callbacks handleLinhaClick e handleQuickAdd.
// - CartNotification: recebe estado e dados do item para renderizar o pop-up.
//
// Acessibilidade e UX
// - Notificação aparece e pode ser fechada (onClose no CartNotification).
// - Navegação preserva parâmetros na URL, permitindo compartilhamento/volta ao estado.
//
// Boas práticas de manutenção
// - Não acople lógica de API neste arquivo além do “Quick Add” mínimo.
// - Componentizar novos destaques em <ProdutoDestaque /> para manter a Home enxuta.
// - Caso surja necessidade de tracking, encapsular no handler para manter coesão.
//
// Erros comuns e diagnóstico
// - 401 ao tentar quick add: esperado quando não autenticado — o fluxo já chama
//   triggerLoginAlert(); verifique o interceptor global de API se precisar redirecionar.
// - Falha no cartAdd(): exibe alert genérico e loga no console. Ajuste mensagens
//   conforme políticas de UX do projeto.
//
// Pontos de extensão
// - Adicionar carrosséis, seções editoriais, ou banners dinâmicos.
// - Integrar recomendações personalizadas (ex.: baseadas em histórico do usuário).
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import Header from '../Componentes/Header.jsx';
import Banner from '../Componentes/Banner.jsx';
import Categorias from '../Componentes/Categorias.jsx';
import ProdutoDestaque from '../Componentes/ProdutoDestaque.jsx';
import Marcas from '../Componentes/Marcas.jsx';
import Footer from '../Componentes/Footer.jsx';
import { useNavigate } from 'react-router-dom';

// NOVO: Imports para Quick Add e Notificação
import CartNotification from '../Componentes/CartNotification.jsx';
import "/public/style/cartNotification.scss";
import { useAuth } from "../contexts/auth-context.jsx";
import { cartAdd } from "../lib/api.js";

function Home() {
    const navigate = useNavigate();
    const { user, fetchCartCount, triggerLoginAlert } = useAuth();

    // Estado para a notificação
    const [notification, setNotification] = useState({
        isVisible: false,
        data: null,
    });

    const handleLinhaClick = (produto) => {
        const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
        navigate(`/produto?${params.toString()}`);
    };

    // Lidar com o clique em categoria
    const handleCategoryClick = (categoryName) => {
        const params = new URLSearchParams({ termo: categoryName });
        navigate(`/resultados?${params.toString()}`);
    };

    // NOVO: Lógica de Adicionar ao Carrinho Rápido (Quick Add)
    const handleQuickAdd = async (produto) => {
        if (!user) {
            triggerLoginAlert();
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

    return (
        <div className="container">
            <Header />
            <Banner />
            <Categorias onCategoryClick={handleCategoryClick} />
            <ProdutoDestaque 
                produtoDestaque="disco de freio" 
                handleLinhaClick={handleLinhaClick} 
                handleQuickAdd={handleQuickAdd} 
            />
            <ProdutoDestaque 
                produtoDestaque="pastilha" 
                handleLinhaClick={handleLinhaClick} 
                handleQuickAdd={handleQuickAdd} 
            />
            <Marcas />
            <Footer />
            <CartNotification 
                isVisible={notification.isVisible}
                onClose={() => setNotification(v => ({...v, isVisible: false}))}
                productData={notification.data}
            />
        </div>
    );
}

export default Home;
