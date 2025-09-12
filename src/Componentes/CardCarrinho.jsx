// src/Componentes/CardCarrinho.jsx
import React from 'react';
import '/public/style/cardCarrinho.scss';
import '/public/style/produtoDestaque.scss';
import '/public/style/produtoDestaque.scss';

function CardCarrinho({ produtos, handleCardClick }) {
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
                <div
                    key={item.id}
                    className="produto-card-detaque"
                    onClick={() => handleCardClick(item)}
                >
                    <img src={item.url_imagem} alt={item.nome} className="produto-img-destaque" />
                    <div className="produto-info">
                        <p className="produto-nome">{item.nome}</p>
                        <div className="precos">
                            {/* Use as chaves corretas do objeto */}
                            <p className="preco-antigo">De: R$ {item.preco_original?.toFixed(2)}</p>
                            <p className="preco-novo">
                                Por: <span className="preco-principal">R$ {item.preco_final?.toFixed(2)}</span>
                            </p>
                            <p className="preco-parcelado">ou em até 10x de R$ {item.preco_final ? (item.preco_final / 10).toFixed(2) : '0.00'}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardCarrinho;