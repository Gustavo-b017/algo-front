// src/Paginas/Carrinho.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../Componentes/Footer';
import Header from '../Componentes/Header';
import { useNavigate } from 'react-router-dom';
import CardCarrinho from '../Componentes/CardCarrinho';
import '/public/style/cardProduto.scss';
import '/public/style/cardCarrinho.scss';
import '/public/style/footer.scss';
import '/public/style/cardProduto.scss';
import '/public/style/produtoDestaque.scss';

const API_URL = import.meta.env.VITE_API_URL;
//const API_URL = 'http://127.0.0.1:5000';

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

    const handleCardClick = (produto) => {
        const params = new URLSearchParams({ id: produto.id_api_externa, nomeProduto: produto.nome });
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
                    <CardCarrinho
                        produtos={produtos}
                        handleCardClick={handleCardClick}
                        handleRemoverItem={handleRemoverItem}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Carrinho;