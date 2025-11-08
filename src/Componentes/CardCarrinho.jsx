// src/Componentes/CardCarrinho.jsx
// ============================================================================
// Componente: CardCarrinho (lista de itens do carrinho)
// ----------------------------------------------------------------------------
// Propósito
// - Renderizar a lista de produtos presentes no carrinho com imagem, informações
//   básicas, controles de quantidade e subtotal por item.
//
// Diretrizes (alinhadas às do back-end)
// - Responsabilidade única: componente estritamente de apresentação e interação
//   local; toda a mutação de estado global/servidor é delegada via callbacks.
// - Previsibilidade: não mantém estado próprio; depende de props controladas.
// - Acessibilidade: inclui textos alternativos em imagens e rótulos textuais;
//   as ações têm ícones com `alt` adequados.
// - Performance: renderização simples baseada em array; chaves estáveis por
//   `id_api_externa`; evita re-renderizações desnecessárias ao não criar
//   estados internos.
// - Extensibilidade: estilização isolada em SCSS; eventuais campos adicionais
//   podem ser incluídos em cada item sem alterar a estrutura do controle.
//
// Observações
// - `formatBRL` está declarado para formatação em moeda BRL, mas não é usado
//   no markup atual (mantido conforme o original).
// - Os cálculos monetários usam `toFixed(2)` apenas para exibição; regras de
//   arredondamento/parcelamento reais devem ser feitas no back-end.
// - `stopPropagation()` é aplicado nos botões +/-/lixo para impedir o clique
//   no card abrir a página do produto.
//
// Requisitos de integração
// - `produtos`: array de itens com as propriedades usadas abaixo.
// - `handleCardClick(item)`: navega para a página do produto selecionado.
// - `handleRemoverItem(id_api_externa)`: remove o item do carrinho.
// - `handleUpdateQuantidade(id_api_externa, novaQuantidade)`: atualiza qtd.
// ============================================================================

import React from 'react';
import '/public/style/cardCarrinho.scss';
import trash_icon from '../../public/imagens/icones/trash.svg'
import plus_icon from '../../public/imagens/icones/plus.svg'
import minus_icon from '../../public/imagens/icones/menos.svg'

// Utilitário de formatação em BRL (não utilizado no JSX atual; mantido)
const formatBRL = (v) =>
    typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

function CardCarrinho({ produtos, handleCardClick, handleRemoverItem, handleUpdateQuantidade }) {
    // Estado vazio: mensagem amigável e call-to-action
    if (!produtos || produtos.length === 0) {
        return (
            <div className="empty-state-container">
                <h1>Seu carrinho está vazio.</h1>
                <p>Adicione produtos para começar a comprar.</p>
            </div>
        );
    }

    return (
        // Container da lista de itens do carrinho
        <div className="carrinho-container">
            {produtos.map((item) => (
                // Card do produto no carrinho (key estável por id_api_externa)
                <div key={item.id_api_externa} className="produto-card-carrinho">
                    {/* Coluna da imagem do produto */}
                    <div className="carrinho-imagem-container">
                        <img src={item.url_imagem} alt={item.nome} className="produto-imagem-carrinho" />
                    </div>

                    {/* Coluna: informações e ações */}
                    <div className="produto-info-carrinho">

                        {/* Área clicável: leva à página do produto */}
                        <div className="carrinho-detalhes-produto" onClick={() => handleCardClick(item)}>
                            <h4 className="produto-nome-carrinho">{item.nome}</h4>
                            <p className="produto-marca-carrinho">Marca: <strong>{item.marca}</strong></p>

                            {/* Bloco de preços (exibição) */}
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

                        {/* Ações: quantidade e subtotal por item */}
                        <div className="carrinho-actions">
                            <div className="carrinho-quantidade-group">
                                {/* Se quantidade == 1, o botão esquerdo vira "remover item" (ícone de lixeira) */}
                                {item.quantidade === 1 ? (
                                    <button
                                        className="carrinho-btn-lixo"
                                        onClick={(e) => {
                                            e.stopPropagation(); // evita abrir o produto
                                            handleRemoverItem(item.id_api_externa);
                                        }}
                                    >
                                        <img src={trash_icon} alt="Remover item" />
                                    </button>
                                ) : (
                                    // Caso contrário, decrementa a quantidade em 1
                                    <button
                                        className="carrinho-btn-menos"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateQuantidade(item.id_api_externa, item.quantidade - 1);
                                        }}
                                    >
                                        <img src={minus_icon} alt="Remover unidade" />
                                    </button>
                                )}

                                {/* Quantidade atual (somente exibição) */}
                                <span className="carrinho-quantidade">{item.quantidade}</span>

                                {/* Incrementa a quantidade em 1 */}
                                <button
                                    className="carrinho-btn-mais"
                                    onClick={(e) => {
                                        e.stopPropagation(); // impede o clique no card
                                        handleUpdateQuantidade(item.id_api_externa, item.quantidade + 1);
                                    }}
                                >
                                    <img src={plus_icon} alt="Adicionar unidade" />
                                </button>
                            </div>

                            {/* Subtotal do item (quantidade x preço final) */}
                            <p className="carrinho-subtotal">R$ {(item.quantidade * item.preco_final).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardCarrinho;
