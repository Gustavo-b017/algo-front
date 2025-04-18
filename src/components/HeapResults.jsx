import React from 'react';

const HeapResults = ({ heapResults, loadingHeap, onTesteHeap }) => {
  return (
    <>
      <h3 className="mt-4">Teste do Heap (k Elementos):</h3>
      <button className="btn btn-secondary mt-2" onClick={onTesteHeap}>
        Teste Heap
      </button>
      {loadingHeap && (
        <div className="text-center mt-2">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Carregando Heap...</span>
          </div>
        </div>
      )}
      {heapResults.length > 0 && (
        <div className="mt-3">
          <h4>Resultados do Heap</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nome do Produto</th>
                <th>Potência (HP)</th>
                <th>Montadora</th>
                <th>Valor Numérico (HP)</th>
              </tr>
            </thead>
            <tbody>
              {heapResults.map((item, index) => {
                const info = item.data ? item.data : item;
                const nomeProduto = info.nomeProduto || "N/A";
                let potencia = "N/A";
                let montadora = "N/A";
                if (info.aplicacoes && info.aplicacoes.length > 0) {
                  potencia = info.aplicacoes[0].hp || "N/A";
                  montadora = info.aplicacoes[0].montadora || "N/A";
                }
                return (
                  <tr key={index}>
                    <td>{nomeProduto}</td>
                    <td>{`Potência (HP): ${potencia}`}</td>
                    <td>{montadora}</td>
                    <td>{potencia !== "N/A" ? parseFloat(potencia) : "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default HeapResults;
