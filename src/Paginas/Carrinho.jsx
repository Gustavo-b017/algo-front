// src/Paginas/Carrinho.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../Componentes/Footer';
import Header from '../Componentes/Header';
import { useNavigate } from 'react-router-dom';
import CardCarrinho from '../Componentes/CardCarrinho';
import ResumoCompra from '../Componentes/ResumoCompra';
import '/public/style/carrinho.scss';
import '/public/style/cardProduto.scss';
import '/public/style/cardCarrinho.scss';
import '/public/style/footer.scss';
import '/public/style/produtoDestaque.scss';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Carrinho() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();


    const buscarProdutosCarrinho = async () => {
        setCarregando(true);
        try {
            const res = await axios.get(`${API_URL}/carrinho`);
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
            // Usando a nova rota POST com o corpo da requisição
            await axios.post(`${API_URL}/carrinho/produto/remover`, { id_api_externa });
            // Recarrega a lista de produtos após a remoção
            buscarProdutosCarrinho();
        } catch (error) {
            console.error("Erro ao remover o item:", error);
            alert("Não foi possível remover o item do carrinho.");
        }
    };

    // FUNÇÃO para atualizar a quantidade
    const handleUpdateQuantidade = async (id_api_externa, novaQuantidade) => {
        // Impede que a quantidade seja menor que 1
        if (novaQuantidade < 1) return;

        try {
            await axios.post(`${API_URL}/carrinho/produto/atualizar-quantidade`, {
                id_api_externa,
                quantidade: novaQuantidade
            });
            // Recarrega o carrinho para atualizar a interface
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
                <h2 className="carrinho-titulo">Seu Carrinho</h2>
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
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Carrinho;