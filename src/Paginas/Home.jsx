// src/Paginas/Home.jsx
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
    const { user, fetchCartCount } = useAuth();

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
