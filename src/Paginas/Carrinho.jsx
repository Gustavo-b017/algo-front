// src/Paginas/Carrinho.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../Componentes/Header";
import Footer from "../Componentes/Footer";
import CardCarrinho from "../Componentes/CardCarrinho";
import ResumoCompra from "../Componentes/ResumoCompra";
import ProdutoDestaque from "../Componentes/ProdutoDestaque";

import { api } from "../lib/api";
import { useAuth } from "../contexts/auth-context";

// Estilos da página e componentes usados
import "/public/style/carrinho.scss";
import "/public/style/cardCarrinho.scss";
import "/public/style/produtoDestaque.scss";

function Carrinho() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const navigate = useNavigate();
    const { fetchCartCount } = useAuth(); // NOVO: Consumir fetchCartCount

    const toNumber = (v) =>
        typeof v === "number"
            ? v
            : Number(String(v).replace(/\./g, "").replace(",", "."));

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

    useEffect(() => {
        let alive = true;
        (async () => {
            await buscarProdutosCarrinho();
        })();
        return () => {
            alive = false;
        };
    }, []);

    // Remoção com atualização otimista
    async function handleRemoverItem(id_api_externa) {
        try {
            const prev = produtos;
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

    // Atualização de quantidade com guarda mínima e otimista
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

    function handleCardClick(produto) {
        const params = new URLSearchParams({
            id: produto.id_api_externa,
            nomeProduto: produto.nome,
        });
        navigate(`/produto?${params.toString()}`);
    }

    function handleLinhaClick(produto) {
        // Mantido conforme seu padrão (alguns destaques usam `id`)
        const params = new URLSearchParams({
            id: produto.id ?? produto.id_api_externa,
            nomeProduto: produto.nome,
        });
        navigate(`/produto?${params.toString()}`);
    }

    // Totais
    const subtotal = produtos.reduce((acc, item) => {
        const preco = toNumber(item.preco_final ?? 0);
        const qtd = toNumber(item.quantidade ?? 0);
        return acc + preco * qtd;
    }, 0);

    const totalItens = produtos.reduce(
        (acc, item) => acc + toNumber(item.quantidade ?? 0),
        0
    );

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

    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <h2 className="carrinho-titulo">Meu Carrinho</h2>

                {!!erro && (
                    <div className="inline-alert inline-alert--error" role="alert">
                        {erro}
                    </div>
                )}

                <div className="carrinho-container">
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

                    <aside className="carrinho-resumo">
                        <ResumoCompra subtotal={subtotal} totalItens={totalItens} />
                    </aside>

                    <section className="carrinho-destaque">
                        <ProdutoDestaque
                            produtoDestaque="pastilha"
                            handleLinhaClick={handleLinhaClick}
                        />
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Carrinho;
