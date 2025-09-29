// Sugestoes.jsx
import React from 'react';
import '/public/style/sugestao.scss';

// O componente agora recebe também a função de clique
function Sugestoes({ dadosSimilares, onSugestaoClick }) {

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
            <div className="aplicacoes-grid-sugestao">
              {similares.map((produto, index) => (
                <div
                  key={produto.id || index}
                  className="aplicacao-card-sugestao"
                  onClick={() => onSugestaoClick(produto)} // Adicione o evento de clique
                >
                  <div className="aplicacao-header">

                    <p>{produto.nomeProduto}</p>
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
                <div
                  key={index}
                  className="aplicacao-card"
                  onClick={() => onSugestaoClick(produto)} // Adicione o evento de clique
                >
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