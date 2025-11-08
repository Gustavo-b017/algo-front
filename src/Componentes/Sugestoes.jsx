// src/Componentes/Sugestoes.jsx
// ============================================================================
// Componente: Sugestoes
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir blocos de produtos “Similares” e “Parcialmente Similares” vindos do
//   backend, permitindo que o usuário navegue para o detalhe ao clicar.
// - Este componente é **puramente de apresentação** (não chama API).
//
// Diretrizes alinhadas ao back
// - Mantém o **contrato de dados** enviado pelo backend, sem renomear campos:
//   • dadosSimilares.similares: Array de itens com { id?, nomeProduto, codigoReferencia?, marca? }
//   • dadosSimilares.produtosParcialmenteSimilares: Array de itens com { id?, nomeProduto, marca? }
// - A ação de clique (onSugestaoClick) apenas repassa o objeto do produto para
//   o componente pai, que é quem conhece o roteamento e o mapeamento da query
//   para a API (ex.: /produto?id=<id>&nomeProduto=<nome>).
//
// Contrato (props)
// - dadosSimilares: {
//     similares?: Array<Produto>,
//     produtosParcialmenteSimilares?: Array<Produto>
//   }
// - onSugestaoClick(produto): function => chamado ao clicar no card.
//
// Regras de renderização
// - Retorna null quando não houver dados para mostrar (estado “silencioso”,
//   não polui a tela).
// - Renderiza até dois blocos (Similares / Parcialmente Similares), cada um
//   com grade rolável horizontal (estilização via CSS externo).
//
// Acessibilidade e UX
// - Títulos <h2> identificam os grupos.
// - Cards inteiros são clicáveis para facilitar a interação.
//
// Notas de robustez / limites
// - O guard clause inicial acessa `.length` direto em
//   `dadosSimilares.similares` e `dadosSimilares.produtosParcialmenteSimilares`.
//   Se alguma dessas chaves vier `undefined`, haverá erro. Uma alternativa
//   (não aplicada aqui para manter o código original) seria usar optional
//   chaining: `dadosSimilares?.similares?.length`.
// - A chave do map usa `produto.id || index`. Idealmente, `id` exclusivo
//   deve ser fornecido pelo backend para evitar re-renderizações desnecessárias.
//
// Cenários de teste sugeridos
// - `dadosSimilares` undefined/null -> não renderiza.
// - Somente “similares” com itens -> renderiza um bloco.
// - Somente “parciais” com itens -> renderiza um bloco.
// - Ambos com itens -> renderiza dois blocos.
// - Clique no card chama `onSugestaoClick` com o objeto correto.
// ============================================================================

import React from 'react';
import '/public/style/sugestao.scss';

// O componente recebe a lista de sugestões e um callback para clique no item.
function Sugestoes({ dadosSimilares, onSugestaoClick }) {

  // Guard clause: não renderiza se não houver dados (ver nota de robustez acima).
  if (
    !dadosSimilares ||
    (dadosSimilares.similares.length === 0 &&
     dadosSimilares.produtosParcialmenteSimilares.length === 0)
  ) {
    return null;
  }

  // Normaliza arrays para evitar checks repetidos na renderização.
  const similares = dadosSimilares.similares || [];
  const parciais = dadosSimilares.produtosParcialmenteSimilares || [];

  return (
    <div className="sugestoes-container">
      {/* Bloco: Produtos Similares */}
      {similares.length > 0 && (
        <div className="sugestoes-bloco">
          <h2 className="secao-titulo">Produtos Similares</h2>
          <div className="aplicacoes-scroll-limitada">
            <div className="aplicacoes-grid-sugestao">
              {similares.map((produto, index) => (
                <div
                  key={produto.id || index}                  // ver nota sobre chaves
                  className="aplicacao-card-sugestao"
                  onClick={() => onSugestaoClick(produto)}   // repassa o produto ao pai
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

      {/* Bloco: Produtos Parcialmente Similares */}
      {parciais.length > 0 && (
        <div className="sugestoes-bloco">
          <h2 className="secao-titulo">Produtos Parcialmente Similares</h2>
          <div className="aplicacoes-scroll-limitada">
            <div className="aplicacoes-grid">
              {parciais.map((produto, index) => (
                <div
                  key={index}                                 // fallback quando id não está presente
                  className="aplicacao-card"
                  onClick={() => onSugestaoClick(produto)}    // repassa o produto ao pai
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
