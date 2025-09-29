// src/Componentes/CardCarrinho.jsx
import React from 'react';
import '/public/style/cardCarrinho.scss';
import '/public/style/produtoDestaque.scss';
import trash_icon from '../../public/imagens/icones/trash.svg'
import plus_icon from '../../public/imagens/icones/plus.svg'

const formatBRL = (v) =>
    typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

function CardCarrinho({ produtos, handleCardClick, handleRemoverItem, handleUpdateQuantidade }) {
    if (!produtos || produtos.length === 0) {
        return (
            <div className="empty-state-container">
                <h1>Seu carrinho está vazio.</h1>
                <p>Adicione produtos para começar a comprar.</p>
            </div>
        );
    }

    return (
        <div className="carrinho-container"> {/* Container principal da lista */}
            {produtos.map((item) => (
                <div key={item.id_api_externa} className="produto-card-carrinho"> {/* NOVO NOME DA CLASSE */}

                    {/* Imagem */}
                    <div className="carrinho-imagem-container">
                        <img src={item.url_imagem} alt={item.nome} className="produto-imagem-carrinho" />
                    </div>

                    {/* Seção Principal do Produto (Imagem + Info) */}
                    <div className="produto-info-carrinho">

                        {/* Informações */}
                        <div className="carrinho-detalhes-produto" onClick={() => handleCardClick(item)}>
                            <h4 className="produto-nome-carrinho">{item.nome}</h4>
                            <p className="produto-marca-carrinho">Marca: <strong>{item.marca}</strong></p>

                            {/* Preços */}
                            <div className="carrinho-precos">
                                {item.preco_original && (
                                    <p className="preco-antigo-carrinho">De: R$ <span>{item.preco_original.toFixed(2)}</span></p>
                                )}
                                <p className="preco-novo-carrinho">Por: <strong>R$ {item.preco_final.toFixed(2)}</strong> no Pix</p>
                                <p className="preco-parcelado-carrinho">
                                    ou em até <strong>10x de R$ {(item.preco_final / 10).toFixed(2)}</strong> sem juros
                                </p>
                            </div>
                        </div>

                        {/* Seção de Ações do Carrinho */}
                        <div className="carrinho-actions">
                            <div className="carrinho-quantidade-group">
                                {/* Lógica de renderização condicional */}
                                {item.quantidade === 1 ? (
                                    <button
                                        className="carrinho-btn-lixo"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoverItem(item.id_api_externa);
                                        }}
                                    >
                                        <img src={trash_icon} alt="Remover item" />
                                    </button>
                                ) : (
                                    <button
                                        className="carrinho-btn-menos"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateQuantidade(item.id_api_externa, item.quantidade - 1);
                                        }}
                                    >
                                        -
                                    </button>
                                )}
                                <span className="carrinho-quantidade">{item.quantidade}</span>
                                <button
                                    className="carrinho-btn-mais"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Impede que o clique no card seja disparado
                                        handleUpdateQuantidade(item.id_api_externa, item.quantidade + 1);
                                    }}
                                >
                                    <img src={plus_icon} alt="Adicionar unidade" />
                                </button>
                            </div>
                            <p className="carrinho-subtotal">R$ {(item.quantidade * item.preco_final).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardCarrinho;