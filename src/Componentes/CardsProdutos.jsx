// src/Componentes/CardsProdutos.jsx
// ============================================================================
// Componente: CardsProdutos (grade/lista de cards de produtos)
// ----------------------------------------------------------------------------
// Propósito
// - Exibir resultados de busca em formato de cards, com imagem, nome,
//   preços (à vista e parcelado) e ação de "adicionar ao carrinho" (quick add).
// - Oferecer paginação básica ("Voltar" / "Próxima") e mensagem de feedback.
//
// Diretrizes (alinhadas ao back-end)
// - Responsabilidade única: apresentação + disparo de callbacks; não contém
//   estado global nem faz requisições; decisões de negócio residem fora.
// - Previsibilidade: recebe todos os dados e handlers por props controladas;
//   não realiza mutações locais que afetem o servidor.
// - Acessibilidade: inclui textos alternativos em imagens; botões possuem
//   `title` e `aria-label` descritivos; feedback exibido em região dedicada.
// - Performance: chaves estáveis na grade de cards; evita cálculos pesados no
//   render; formatação de moeda isolada em utilitário simples.
// - Extensibilidade: classes SCSS isoladas; campos extras podem ser
//   adicionados aos itens sem quebrar o contrato do componente.
//
// Requisitos de integração
// - `resultados`: array de itens com propriedades esperadas (id, nome, imagemReal,
//   preco, precoOriginal, descontoPercentual, parcelas{qtd, valor}).
// - `paginaAtual`, `totalPaginas`: controle de paginação.
// - `buscarTratados(novaPagina)`: callback para troca de página.
// - `handleLinhaClick(item)`: navegação para detalhes do produto.
// - `carregandoTabela`: indica estado de carregamento.
// - `feedbackMessage`: texto complementar de orientação ao usuário.
// - `handleQuickAdd(item)`: ação de adicionar 1 unidade ao carrinho.
// - `actionText`, `onActionClick`: ação sugerida em estado vazio (ex.: limpar filtros).
// ============================================================================

import React from 'react';
import '/public/style/cardProduto.scss';
import carrinho_icon from '../../public/imagens/icones/carrinho.svg';

// Utilitário de formatação em BRL
const formatBRL = (v) =>
  typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

function CardsProdutos({
  resultados,
  paginaAtual,
  totalPaginas,
  buscarTratados,
  handleLinhaClick,
  carregandoTabela,
  feedbackMessage,
  handleQuickAdd,
  actionText,
  onActionClick }) {

  // Estado de carregamento: spinner centralizado e mensagem discreta
  if (carregandoTabela) {
    return (
      <div className="loader-container">
        <div className="loader-circle"></div>
        <p className="notive_load">Carregando...</p>
      </div>
    );
  }

  const temMaisPaginas = paginaAtual < totalPaginas;

  // Estado vazio: orientação + ação sugerida (ex.: "Limpar filtros")
  if (!resultados || resultados.length === 0) {
    return (
      <div className="empty-state-container">
        {/* Mensagem principal minimalista */}
        <h1>Ops! Não encontramos a peça.</h1>
        {/* Mensagem de suporte/guia */}
        <p>{feedbackMessage || "Tente refinar sua busca com menos palavras-chave ou verifique a ortografia. Você também pode limpar os filtros aplicados."}</p>

        {/* Botão de ação contextual (opcional) */}
        {onActionClick && (
          <button
            className="empty-state-action-btn"
            onClick={onActionClick}
            aria-label={actionText}
          >
            {actionText || "Limpar Filtros"}
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mensagem de feedback contextual (ex.: contagem de resultados) */}
      {feedbackMessage && (
        <div className="feedback-message-seach" role="alert" >
          {feedbackMessage}
        </div>
      )}

      {/* Grade de cards de produtos */}
      <div className="cards-grid">
        {resultados.map((item, i) => (
          <div
            key={`${item.id}-${i}`}            // chave estável por item
            className="produto-card"
            onClick={() => handleLinhaClick(item)} // click no card -> navega
          >
            {/* Tag de desconto (quando houver) */}
            {item.descontoPercentual > 0 && (
              <span className="tag-message">{item.descontoPercentual}% OFF</span>
            )}

            {/* Imagem do produto com alt descritivo */}
            <img src={item.imagemReal} alt={item.nome} className="produto-imagem" />

            {/* Ação de quick add: para o clique não “vazar” ao card, usa stopPropagation */}
            <button
              className="add-carrinho-btn"
              onClick={(e) => {
                e.stopPropagation(); // impede a navegação pelo clique no card
                if (handleQuickAdd) {
                  handleQuickAdd(item);
                }
              }}
              title="Adicionar 1 item ao carrinho"
            >
              <img src={carrinho_icon} alt="Ícone de carrinho" />
            </button>

            {/* Informações textuais do produto */}
            <div className="produto-info">
              <p className='produto-nome'>{item.nome}</p>

              {/* Bloco de preços: antigo (quando maior que o atual), atual e parcelado */}
              <div className="produto-precos">
                {typeof item.precoOriginal === 'number' && item.precoOriginal > (item.preco ?? 0) && (
                  <p className="preco-antigo">
                    De: <span>{formatBRL(item.precoOriginal)}</span>
                  </p>
                )}

                <p className="preco-novo">
                  Por: <span className="preco-principal">{formatBRL(item.preco)}</span> no Pix
                </p>

                {item.parcelas?.qtd && item.parcelas?.valor && (
                  <p className="preco-parcelado">
                    {item.parcelas.qtd}x de {formatBRL(item.parcelas.valor)} sem juros
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de paginação: simples e previsíveis */}
      <div className="tabela-controle">
        <button
          disabled={paginaAtual === 1}
          onClick={() => buscarTratados(paginaAtual - 1)}
        >
          {'<'} Voltar
        </button>

        <div className="paginacao-info">
          Página {paginaAtual} de {totalPaginas}
        </div>

        <button
          className="botao-proximo"
          disabled={!temMaisPaginas}
          onClick={() => buscarTratados(paginaAtual + 1)}
        >
          Próxima {'>'}
        </button>
      </div>
    </>
  );
}

export default CardsProdutos;
