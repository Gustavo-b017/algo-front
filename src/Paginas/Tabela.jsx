// src/Paginas/Tabela.jsx

import React from 'react';
import '../Estilosao/tabela.css';

function Tabela({ resultados, paginaAtual, totalPaginas, buscarTratados, handleLinhaClick, carregandoTabela, feedbackMessage }) {
  if (carregandoTabela) {
    return (
      <div className="tabela-carregando">
        <h1>Carregando dados...</h1>
      </div>
    );
  }

  const temMaisPaginas = paginaAtual < totalPaginas;

  // Se não houver resultados e não houver uma mensagem de feedback, não exibe nada.
  if (!resultados || resultados.length === 0) {
    return (
      <div className="tabela-carregando">
        <h1>Nenhum resultado encontrado.</h1>
        {feedbackMessage && (
          <div className="alert alert-info text-center" role="alert" style={{ marginTop: '20px' }}>
            {feedbackMessage}
          </div>
        )}
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