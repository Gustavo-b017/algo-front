
import React from "react";

function ResultsTable({ results, loading }) {
  if (loading) return <div>Carregando...</div>;
  if (!results.length) return <div>Nenhum resultado encontrado.</div>;

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-sm">
        <thead className="table-light">
          <tr>
            <th>Nome</th>
            <th>Marca</th>
            <th>Preço</th>
            <th>Ano</th>
            <th>Potência</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, i) => (
            <tr key={i}>
              <td>{item.nome}</td>
              <td>{item.marca}</td>
              <td>{item.preco}</td>
              <td>{item.ano}</td>
              <td>{item.potencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
