// src/Paginas/Carrinho.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../Componentes/Footer';
import Header from '../Componentes/Header';
import CardsProdutos from '../Componentes/CardsProdutos';
import '/public/style/cardProduto.scss';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:5000';

function Carrinho() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const buscarProdutosCarrinho = async () => {
            try {
                const res = await axios.get(`${API_URL}/carrinho`);
                if (res.data.success) {
                    setProdutos(res.data.produtos);
                    setMensagem(res.data.produtos.length === 0 ? 'Seu carrinho está vazio.' : '');
                } else {
                    setMensagem('Não foi possível carregar os produtos do carrinho.');
                }
            } catch (error) {
                console.error("Erro ao buscar produtos do carrinho:", error);
                setMensagem('Erro de conexão com o servidor.');
            } finally {
                setCarregando(false);
            }
        };

        buscarProdutosCarrinho();
    }, []);

    // Nova função para lidar com o clique no card
    const handleCardClick = (produto) => {
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

    const resultadosAdaptados = produtos.map(p => ({
        id: p.id,
        nome: p.nome,
        marca: 'N/A', // A API interna não retorna a marca para o card
        codigoReferencia: p.codigo_referencia,
        imagemReal: p.url_imagem,
        precoOriginal: p.preco_original,
        preco: p.preco_final,
        desconto: p.desconto
    }));

    return (
        <div className="container-fluid">
            <Header />
            <div className="main-content">
                <h2 style={{ textAlign: 'center', margin: '40px 0' }}>Seu Carrinho</h2>
                <div className="cards-grid">
                    <CardsProdutos
                        resultados={resultadosAdaptados}
                        paginaAtual={1}
                        totalPaginas={1}
                        feedbackMessage={mensagem}
                        handleLinhaClick={handleCardClick} // Adicione esta linha
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Carrinho;