// src/Paginas/Carrinho.jsx
// -----------------------------------------------------------------------------
// Página "Meu Carrinho" (SPA React)
// Responsabilidades principais:
// - Buscar itens do carrinho do usuário autenticado (GET /carrinho).
// - Alterar quantidade, remover itens e manter contadores sincronizados com o Header.
// - Exibir destaque de produtos com ação “Quick Add” (adicionar sem sair da página).
// - Calcular subtotal e total de itens localmente.
// - Notificar visualmente ações de adição ao carrinho.
//
// Diretrizes de manutenção (sem alterar a lógica original):
// - As chamadas à API permanecem centralizadas em ../lib/api (api, cartAdd).
// - O estado global de usuário/contagem vem de useAuth() (fetchCartCount, triggerLoginAlert).
// - Os componentes de UI (CardCarrinho, ResumoCompra etc.) devem receber props puras,
//   sem acoplar lógica de rede neles (separação de responsabilidades).
// - A estratégia de “atualização otimista” é usada para remover/alterar quantidade;
//   sempre há um “recarregar servidor → cliente” para manter consistência.
// - Os estilos SCSS são importados nesta página por conveniência e escopo de UI.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../Componentes/Header";
import Footer from "../Componentes/Footer";
import CardCarrinho from "../Componentes/CardCarrinho";
import ResumoCompra from "../Componentes/ResumoCompra";
import ProdutoDestaque from "../Componentes/ProdutoDestaque";
import CartNotification from '../Componentes/CartNotification.jsx';

import { api } from "../lib/api";
import { useAuth } from "../contexts/auth-context";
import { cartAdd } from "../lib/api.js";

// Estilos da página e componentes usados
import "/public/style/carrinho.scss";
import "/public/style/cardCarrinho.scss";
import "/public/style/produtoDestaque.scss";
import "/public/style/cartNotification.scss";

function Carrinho() {
    // Estado local da página
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    // Contexto de autenticação: usuário atual, atualização do contador do header
    // e alerta quando tentativa de ação ocorrer sem login.
    const { user, fetchCartCount, triggerLoginAlert } = useAuth();

    // Estado da notificação “adicionado ao carrinho”
    const [notification, setNotification] = useState({
        isVisible: false,
        data: null,
    });

    // Normalizador numérico tolerante (suporta “1.234,56” → 1234.56)
    const toNumber = (v) =>
        typeof v === "number"
            ? v
            : Number(String(v).replace(/\./g, "").replace(",", "."));

    // Busca os itens do carrinho do usuário autenticado.
    // Mantém mensagens de erro e spinner de carregamento.
    async function buscarProdutosCarrinho() {
        setCarregando(true);
        setErro("");
        try {
            const res = await api.get("/carrinho");
            if (res?.data?.success) {
                setProdutos(Array.isArray(res.data.produtos) ? res.data.produtos : []);
            } else {
                setErro(res?.data?.error || "Não foi possível carregar o carrinho.");
                setProdutos([]);
            }
        } catch (e) {
            console.error("Erro ao buscar produtos do carrinho:", e);
            setErro("Erro ao carregar o carrinho.");
            setProdutos([]);
        } finally {
            setCarregando(false);
        }
    }

    // Efeito inicial: carrega o carrinho ao montar a página.
    useEffect(() => {
        let alive = true; // marcador reservado para cancelamentos futuros (mantido)
        (async () => {
            await buscarProdutosCarrinho();
        })();
        return () => {
            alive = false;
        };
    }, []);

    // Remoção com atualização otimista:
    // 1) remove localmente para responsividade
    // 2) chama a API
    // 3) sincroniza contador global e recarrega a lista a partir do servidor
    async function handleRemoverItem(id_api_externa) {
        try {
            const prev = produtos; // reserva do estado anterior (mantido)
            setProdutos((list) =>
                list.filter((p) => p.id_api_externa !== id_api_externa)
            );
            await api.post("/carrinho/produto/remover", { id_api_externa });

            await fetchCartCount();

            // Recarrega para manter servidor <-> cliente sincronizados
            await buscarProdutosCarrinho();
        } catch (error) {
            console.error("Erro ao remover o item:", error);
            alert("Não foi possível remover o item do carrinho.");
            await buscarProdutosCarrinho();
        }
    }

    // Atualização de quantidade (otimista + sincronização com servidor)
    async function handleUpdateQuantidade(id_api_externa, novaQuantidade) {
        if (novaQuantidade < 1) return;
        try {
            setProdutos((list) =>
                list.map((p) =>
                    p.id_api_externa === id_api_externa
                        ? { ...p, quantidade: novaQuantidade }
                        : p
                )
            );
            await api.post("/carrinho/produto/atualizar-quantidade", {
                id_api_externa,
                quantidade: novaQuantidade,
            });
            await fetchCartCount();
            await buscarProdutosCarrinho();
        } catch (error) {
            console.error("Erro ao atualizar a quantidade:", error);
            alert("Não foi possível atualizar a quantidade.");
            await buscarProdutosCarrinho();
        }
    }

    // Navegação para a página de produto a partir do card do carrinho
    function handleCardClick(produto) {
        const params = new URLSearchParams({
            id: produto.id_api_externa,
            nomeProduto: produto.nome,
        });
        navigate(`/produto?${params.toString()}`);
    }

    // Navegação a partir de linhas/destaques (alguns usam `id`, outros `id_api_externa`)
    function handleLinhaClick(produto) {
        // Mantido conforme seu padrão (alguns destaques usam `id`)
        const params = new URLSearchParams({
            id: produto.id ?? produto.id_api_externa,
            nomeProduto: produto.nome,
        });
        navigate(`/produto?${params.toString()}`);
    }

    // Cálculo de subtotal e total de itens (derivados do estado `produtos`)
    const subtotal = produtos.reduce((acc, item) => {
        const preco = toNumber(item.preco_final ?? 0);
        const qtd = toNumber(item.quantidade ?? 0);
        return acc + preco * qtd;
    }, 0);

    const totalItens = produtos.reduce(
        (acc, item) => acc + toNumber(item.quantidade ?? 0),
        0
    );

    // Estado de carregamento inicial
    if (carregando) {
        return (
            <div className="page page--loading">
                <div className="loader-container">
                    <div className="loader-circle" />
                    <p>Carregando…</p>
                </div>
            </div>
        );
    }

    // Handler do "Quick Add" no bloco de destaque:
    // - Exige usuário autenticado (senão dispara alerta de login).
    // - Dispara /salvar_produto, sincroniza contador e lista,
    //   e abre notificação visual temporária.
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
            
            await fetchCartCount(); // 1. Atualiza o contador no Header
            await buscarProdutosCarrinho(); // 2. Atualiza o carrinho na página atual

            setNotification({
                isVisible: true,
                data: { ...itemToAdd, preco_final: itemToAdd.preco_final, url_imagem: itemToAdd.url_imagem }
            });

        } catch (error) {
            console.error("Erro ao adicionar item rápido:", error);
            alert("Não foi possível adicionar o item. Tente novamente.");
        }
    };

    return (
        <div className="container">
            {/* Cabeçalho global do site (inclui contador do carrinho) */}
            <Header />
            <main className="main-content">
                <h2 className="carrinho-titulo">Meu Carrinho</h2>

                {!!erro && (
                    <div className="inline-alert inline-alert--error" role="alert">
                        {erro}
                    </div>
                )}

                <div className="carrinho-container">
                    {/* Coluna principal: lista de itens do carrinho */}
                    <div className="carrinho-produtos">
                        {produtos.length === 0 ? (
                            <div className="carrinho-vazio" role="region" aria-label="Carrinho vazio">
                                <p>Seu carrinho está vazio.</p>
                                <button
                                    type="button"
                                    className="btn-primario"
                                    onClick={() => navigate("/")}
                                >
                                    Continuar comprando
                                </button>
                            </div>
                        ) : (
                            <CardCarrinho
                                produtos={produtos}
                                handleCardClick={handleCardClick}
                                handleRemoverItem={handleRemoverItem}
                                handleUpdateQuantidade={handleUpdateQuantidade}
                            />
                        )}
                    </div>

                    {/* Resumo de valores (subtotal/itens) */}
                    <aside className="carrinho-resumo">
                        <ResumoCompra subtotal={subtotal} totalItens={totalItens} />
                    </aside>

                    {/* Sugestões/destaques com ação de “Quick Add” */}
                    <section className="carrinho-destaque">
                        <ProdutoDestaque
                            produtoDestaque="pastilha"
                            handleLinhaClick={handleLinhaClick}
                            handleQuickAdd={handleQuickAdd}
                        />
                    </section>
                </div>
            </main>
            <Footer />

            {/* Notificação de item adicionado (overlay/toast) */}
            <CartNotification
                isVisible={notification.isVisible}
                onClose={() => setNotification(v => ({ ...v, isVisible: false }))}
                productData={notification.data}
            />

        </div>
    );
}

export default Carrinho;
