// src/Paginas/Item.jsx

import React, { useState } from 'react';
import '../Estilosao/item.css';

// O componente agora recebe os dados diretamente via props
function Item({ dadosItem }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // Se, por alguma razão, os dados não chegarem, mostramos uma mensagem.
  if (!dadosItem) {
    return <div className="text-center mt-5"><h2>Informações do item não disponíveis.</h2></div>;
  }

  // Renomeamos a variável para 'dados' para não ter de mudar o JSX
  const dados = dadosItem;

  return (
    <div className="item-container">
      <div className="item-topo">
        <div className="item-imagem">
          {/* Usamos uma verificação para a imagem, caso ela não exista */}
          <img src={dados.imagemReal} alt={dados.nomeProduto} />
        </div>

        <div className="item-info">
          <h1 className="item-nome">{dados.nomeProduto}</h1>
          <p className="item-marca">Marca: <strong>{dados.marca}</strong></p>
          <p className="item-ref">Família: <strong>{dados.familia?.descricao}</strong></p>
          <p className="item-ref">Referência OEM: <strong>{dados.familia?.subFamiliaDescricao}</strong></p>
        </div>
      </div>

      <div className="item-aplicacoes">
        <h2 className="secao-titulo">Modelos Compatíveis</h2>
        <div className="aplicacoes-scroll-limitada">
          <div className="aplicacoes-grid">
            {dados.aplicacoes.map((aplicacao, index) => (
              <div
                key={aplicacao.id || index}
                className={`aplicacao-card ${hoverIndex === index ? 'ativo' : ''}`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="aplicacao-header">
                  <img src={aplicacao.imagem} alt={aplicacao.nome} className="aplicacao-imagem" />
                  <p><strong>{aplicacao.modelo} -</strong>  {aplicacao.versao}</p>
                  <p>{aplicacao.carroceria} | {aplicacao.montadora}</p>
                </div>

                {hoverIndex === index && (
                  <div className="aplicacao-detalhes">
                    <hr />
                    <p><strong>Motor:</strong> {aplicacao.motor}</p>
                    <p><strong>Combustível:</strong> {aplicacao.combustivel}</p>
                    <p><strong>Potência:</strong> {aplicacao.hp}</p>
                    <p><strong>Cilindros:</strong> {aplicacao.cilindros}</p>
                    <p><strong>Linha:</strong> {aplicacao.linha}</p>
                    <p><strong>Início:</strong> {aplicacao.fabricacaoInicial}</p>
                    <p><strong>Fim:</strong> {aplicacao.fabricacaoFinal}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;