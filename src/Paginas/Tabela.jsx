import React from 'react';
import '../Estilosao/tabela.css';

function Tabela({ resultados, paginaAtual, totalPaginas, temMaisPaginas, buscarTratados, handleLinhaClick, carregandoTabela }) {
  if (carregandoTabela) {
    return (
      <div className="tabela-carregando">
        <h1>Carregando dados...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="tabela-container">
        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Marca</th>
              <th>Potência</th>
              <th>Ano Início</th>
              <th>Ano Fim</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((item, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? 'linha-par' : 'linha-impar'}
                onClick={() => handleLinhaClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <td>{item.nome}</td>
                <td>{item.marca}</td>
                <td>{item.potencia}</td>
                <td>{item.ano_inicio}</td>
                <td>{item.ano_fim}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
