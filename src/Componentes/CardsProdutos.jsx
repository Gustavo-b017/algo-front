// src/Componentes/CardsProdutos.jsx
import React from 'react';
import '/public/style/cardProduto.scss';
import carrinho_icon from '../../public/imagens/icones/add-carrinho.png'; // Ou o caminho para o seu ícone

const formatBRL = (v) =>
  typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

function CardsProdutos({ resultados, paginaAtual, totalPaginas, buscarTratados, handleLinhaClick, carregandoTabela, feedbackMessage }) {
  if (carregandoTabela) {
    return (
      <div className="loader-container">
        <div className="loader-circle"></div>
        <p className="notive_load">Carregando...</p>
      </div>
    );
  }

  const temMaisPaginas = paginaAtual < totalPaginas;

  // Se não houver resultados e não houver uma mensagem de feedback, não exibe nada.
  if (!resultados || resultados.length === 0) {
    return (
      <div className="empty-state-container">
        <h1>Nenhum resultado encontrado...</h1>
        <p>{feedbackMessage}</p>
      </div>

    );
  }

  return (
    <>
      {feedbackMessage && (
        <div className="feedback-message-seach" role="alert" >
          {feedbackMessage}
        </div>
      )}

      <div className="cards-grid">
        {resultados.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="produto-card"
            onClick={() => handleLinhaClick(item)}
          >
            {/* TAG MESSAGE */}
            {item.descontoPercentual > 0 && (
              <span className="tag-message">{item.descontoPercentual}% OFF</span>
            )}

            {/* IMAGEM */}
            <img src={item.imagemReal} alt={item.nome} className="produto-imagem" />

            {/* BOTÃO DO CARRINHO */}
            <button className="add-carrinho-btn">
              <img src={carrinho_icon} alt="Ícone de carrinho" />
            </button>

            <div className="produto-info">

              <p className='produto-nome'>{item.nome}</p>

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