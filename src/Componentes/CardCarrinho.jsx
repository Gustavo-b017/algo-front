// src/Componentes/CardCarrinho.jsx
import React from 'react';
import '/public/style/cardCarrinho.scss';
import '/public/style/produtoDestaque.scss';
import '/public/style/produtoDestaque.scss';

function CardCarrinho({ produtos, handleCardClick, handleRemoverItem }) {
    if (!produtos || produtos.length === 0) {
        return (
            <div className="empty-state-container">
                <h1>Seu carrinho está vazio.</h1>
                <p>Adicione produtos para começar a comprar.</p>
            </div>
        );
    }

    return (
        <div className="carousel-items">
            {produtos.map((item) => (
                <div key={item.id_api_externa} className="produto-card-detaque">
                    <div onClick={() => handleCardClick(item)} style={{ cursor: 'pointer' }}>
                        <img src={item.url_imagem} alt={item.nome} className="produto-img-destaque" />
                        <div className="produto-info">
                            <p className="produto-nome">{item.nome}</p>
                            {/* ... (código dos preços) ... */}
                        </div>
                    </div>

                    <div className="carrinho-actions">
                        {/* Esta linha agora lê a quantidade que vem direto do banco */}
                        <p className="quantidade">Quantidade: <span>{item.quantidade}</span></p>

                        {/* Este botão já chama a função com o id_api_externa, que é o correto para a nova rota */}
                        <button
                            onClick={() => handleRemoverItem(item.id_api_externa)}
                            className="remover-btn"
                        >
                            Remover
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default CardCarrinho;