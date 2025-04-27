import React from 'react';

function Tabela({ resultados, paginaAtual, totalPaginas, temMaisPaginas, buscarTratados, handleLinhaClick, carregandoTabela }) {
  if (carregandoTabela) {
    return (
      <div className="text-center mt-5">
        <h1>Carregando dados...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive w-100">
        <table className="table table-striped table-hover">
          <thead className="table-light">
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
              <tr key={i} style={{ cursor: 'pointer' }} onClick={() => handleLinhaClick(item)}>
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

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={paginaAtual === 1}
          onClick={() => buscarTratados(paginaAtual - 1)}
        >
          Página Anterior
        </button>
        <button
          className="btn btn-secondary bg-primary"
          disabled={!temMaisPaginas}
          onClick={() => buscarTratados(paginaAtual + 1)}
        >
          Próxima Página
        </button>
      </div>
    </>
  );
}

export default Tabela;