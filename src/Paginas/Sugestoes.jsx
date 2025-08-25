// src/Paginas/Sugestoes.jsx

import React from 'react';
import '/public/style/sugestao.css';

// O componente recebe os dados diretamente do componente pai
function Sugestoes({ dadosSimilares }) {

  // Se não houver dados ou se as listas estiverem vazias, não mostramos nada.
  if (!dadosSimilares || (dadosSimilares.similares.length === 0 && dadosSimilares.produtosParcialmenteSimilares.length === 0)) {
    return null;
  }

  const similares = dadosSimilares.similares || [];
  const parciais = dadosSimilares.produtosParcialmenteSimilares || [];

  return (
    <div className="sugestoes-container">
      {similares.length > 0 && (
        <div className="sugestoes-bloco">
          <h2 className="secao-titulo">Produtos Similares</h2>
          <div className="aplicacoes-scroll-limitada">
            <div className="aplicacoes-grid">
              {similares.map((produto, index) => (
                <div key={produto.id || index} className="aplicacao-card">
                  <div className="aplicacao-header">
                    <p><strong>Ref:</strong> {produto.codigoReferencia}</p>
                    <p><strong>Marca:</strong> {produto.marca}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {parciais.length > 0 && (
        <div className="sugestoes-bloco">
          <h2 className="secao-titulo">Produtos Parcialmente Similares</h2>
          <div className="aplicacoes-scroll-limitada">
            <div className="aplicacoes-grid">
              {parciais.map((produto, index) => (
                <div key={index} className="aplicacao-card">
                  <div className="aplicacao-header">
                    <p>{produto.nomeProduto}</p>
                    <p><strong>Marca:</strong> {produto.marca}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sugestoes;