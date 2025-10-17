// src/Paginas/Carrinho.jsx
import React, { useEffect, useState } from 'react';
// 1. Remova a importação direta
// import axios from 'axios'; 
// 2. Importe a instância 'api'
import { api } from '../lib/api'; 
import Footer from '../Componentes/Footer';
import Header from '../Componentes/Header';
import { useNavigate } from 'react-router-dom';
import CardCarrinho from '../Componentes/CardCarrinho';
import ResumoCompra from '../Componentes/ResumoCompra';
import ProdutoDestaque from '../Componentes/ProdutoDestaque';
import '/public/style/carrinho.scss';
import '/public/style/cardProduto.scss';
import '/public/style/cardCarrinho.scss';
import '/public/style/footer.scss';
import '/public/style/produtoDestaque.scss';

function Carrinho() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    const buscarProdutosCarrinho = async () => {
        setCarregando(true);
        try {
            // 3. Use 'api.get'
            const res = await api.get('/carrinho');
            if (res.data.success) {
                setProdutos(res.data.produtos);
            }
        } catch (error) {
            console.error("Erro ao buscar produtos do carrinho:", error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarProdutosCarrinho();
    }, []);

    const handleRemoverItem = async (id_api_externa) => {
        try {
            // 4. Use 'api.post'
            await api.post('/carrinho/produto/remover', { id_api_externa });
            buscarProdutosCarrinho();
        } catch (error) {
            console.error("Erro ao remover o item:", error);
            alert("Não foi possível remover o item do carrinho.");
        }
    };

    // FUNÇÃO para atualizar a quantidade
    const handleUpdateQuantidade = async (id_api_externa, novaQuantidade) => {
        if (novaQuantidade < 1) return;
        try {
            // 5. Use 'api.post'
            await api.post('/carrinho/produto/atualizar-quantidade', {
                id_api_externa,
                quantidade: novaQuantidade
            });
            buscarProdutosCarrinho();
        } catch (error) {
            console.error("Erro ao atualizar a quantidade:", error);
            alert("Não foi possível atualizar a quantidade.");
        }
    };

    const handleCardClick = (produto) => {
        const params = new URLSearchParams({ id: produto.id_api_externa, nomeProduto: produto.nome });
        navigate(`/produto?${params.toString()}`);
    };

    // <<-- CALCULA OS VALORES DO CARRINHO A PARTIR DA LISTA DE PRODUTOS
    const subtotal = produtos.reduce((acc, item) => acc + (item.quantidade * item.preco_final), 0);
    const totalItens = produtos.reduce((acc, item) => acc + item.quantidade, 0);

    const handleLinhaClick = (produto) => {
        const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
        navigate(`/produto?${params.toString()}`);
    };

    if (carregando) {
        return (
            <div className="loader-container" style={{ height: '100vh' }}>
                <div className="loader-circle"></div>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <Header />
            <div className="main-content">
                <h2 className="carrinho-titulo">Meu Carrinho</h2>
                <div className="carrinho-container">
                    <div className="carrinho-produtos">
                        <CardCarrinho
                            produtos={produtos}
                            handleCardClick={handleCardClick}
                            handleRemoverItem={handleRemoverItem}
                            handleUpdateQuantidade={handleUpdateQuantidade}
                        />
                    </div>
                    <div className="carrinho-resumo">
                        <ResumoCompra
                            subtotal={subtotal}
                            totalItens={totalItens}
                        />
                    </div>
                    <div className="carrinho-destaque">
                        <ProdutoDestaque produtoDestaque="pastilha" handleLinhaClick={handleLinhaClick} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Carrinho;