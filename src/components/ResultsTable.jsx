
import React from 'react';

function ResultsTable({ results, loading }) {
  if (loading) return <div>Carregando...</div>;

  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Marca</th>
          <th>Montadora</th>
          <th>Carroceria</th>
          <th>Ano</th>
          <th>Potência</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, index) => {
          const data = item.data || {};
          return (
            <tr key={index}>
              <td>{data.nomeProduto || item.nomeProduto || ''}</td>
              <td>{data.marca || item.marca || ''}</td>
              <td>{data.aplicacoes?.[0]?.montadora || ''}</td>
              <td>{data.aplicacoes?.[0]?.carroceria || ''}</td>
              <td>{data.aplicacoes?.[0]?.fabricacaoInicial || ''} - {data.aplicacoes?.[0]?.fabricacaoFinal || ''}</td>
              <td>{data.aplicacoes?.[0]?.hp || ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ResultsTable;
