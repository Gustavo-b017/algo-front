import React from 'react';
import '/public/style/cardProduto.scss';

function Tabela({ resultados, paginaAtual, totalPaginas, buscarTratados, handleLinhaClick, carregandoTabela, feedbackMessage }) {
  if (carregandoTabela) {
    return (
      <div className="loader-container">
        <div class="loader-circle"></div>
        <p className="notive_load">Carregando...</p>
      </div>
    );
  }

  const temMaisPaginas = paginaAtual < totalPaginas;

  // Se não houver resultados e não houver uma mensagem de feedback, não exibe nada.
  if (!resultados || resultados.length === 0) {
    return (
      <div class="empty-state-container">
        <h1>Nenhum resultado encontrado...</h1>
        <div class="empty-state-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.166 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75h.008v.008h-.008v-.008zM14.25 9.75h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <p>{feedbackMessage}</p>
      </div>

    );
  }

  return (
    <>
      {feedbackMessage && (
        <div className="alert alert-info text-center" role="alert" style={{ marginBottom: '20px' }}>
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
            <img src={item.imagemReal} alt={item.nome} className="produto-imagem" />
            <h3>{item.nome}</h3>
            <p><strong>Marca:</strong> {item.marca}</p>
            <p><strong>Potência:</strong> {item.potencia}</p>
            <p><strong>Ano Início:</strong> {item.ano_inicio}</p>
            <p><strong>Ano Fim:</strong> {item.ano_fim}</p>
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

export default Tabela;