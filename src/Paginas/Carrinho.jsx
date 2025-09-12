// src/Paginas/Carrinho.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../Componentes/Footer';
import Header from '../Componentes/Header';
import { useNavigate } from 'react-router-dom';
import CardCarrinho from '../Componentes/CardCarrinho'; // Importe o novo componente
import '/public/style/cardProduto.scss';
import '/public/style/cardCarrinho.scss'; // Adicione a importação de estilos
import '/public/style/footer.scss';
import '/public/style/cardProduto.scss';
import '/public/style/produtoDestaque.scss';


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
    
    return (
        <div className="container-fluid">
            <Header />
            <div className="main-content">
                <h2 className="carrinho-titulo">Seu Carrinho</h2>
                <div className="carrinho-container">
                    {/* Substitua o CardsProdutos pelo novo CardCarrinho */}
                    <CardCarrinho
                        produtos={produtos}
                        handleCardClick={handleCardClick}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Carrinho;