// src/Paginas/Item.jsx
import React, { useState } from 'react';
import '/public/style/item.scss';
import arrow_left from "../../public/imagens/icones/arrow-left.png";
import arrow_right from "../../public/imagens/icones/arrow-right.png";

const formatBRL = (v) =>
  typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

// O componente agora recebe os dados diretamente via props
function Item({ dadosItem, onSave }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  // Se, por alguma razão, os dados não chegarem, mostramos uma mensagem.
  if (!dadosItem) {
    return <div className="empty-state-container"><h1>Informações do item não disponíveis.</h1></div>;
  }

  const dados = dadosItem;

  const handleSaveClick = () => {
    // 3. ENVIAR A QUANTIDADE JUNTO COM OS OUTROS DADOS
    onSave({
      id_api_externa: dados.id,
      nome: dados.nomeProduto,
      codigo_referencia: dados.codigoReferencia,
      url_imagem: dados.imagemReal,
      preco_original: dados.precoOriginal,
      preco_final: dados.preco,
      desconto: dados.descontoPercentual,
      marca: dados.marca,
      quantidade: quantidade // Adiciona a quantidade selecionada
    });
  };



  return (
    <div className="item-page-container">
      {/* Seção Principal do Produto (Lado Esquerdo e Direito) */}
      <div className="produto-main-section">

        {/* Lado Esquerdo: Imagem e Botões de Ação */}
        <div className="produto-image-gallery">
          <div className="main-image-container">
            <img src={dados.imagemReal} alt={dados.nomeProduto} className="main-product-image" />
            <div className="video-overlay">
              <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Assista ao vídeo</span>
            </div>
          </div>
          <div className="thumbnail-gallery">
            {/* Usando a mesma imagem como exemplo para os thumbnails */}
            <div className="thumbnail-wrapper">
              <img src={dados.imagemReal} alt="thumbnail 1" />
              <div className="video-thumbnail-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="thumbnail-wrapper">
              <img src={dados.imagemReal} alt="thumbnail 2" />
              <div className="video-thumbnail-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="thumbnail-wrapper">
              <img src={dados.imagemReal} alt="thumbnail 3" />
              <div className="video-thumbnail-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="thumbnail-wrapper">
              <img src={dados.imagemReal} alt="thumbnail 4" />
              <div className="video-thumbnail-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Informações e Compra */}
        <div className="produto-info-section">
          <h1 className="produto-titulo">{dados.nomeProduto}</h1>
          <div className="produto-rating">
            {/* Ícones de estrelas aqui, se houver */}
            <span>⭐⭐⭐⭐⭐(45 avaliações)</span>
          </div>
          <p className="produto-codigo">CÓD: <strong>{dados.id}</strong></p>
          <p className="produto-marca">Marca: <strong>{dados.marca}</strong></p>

          <div className="produto-precos">
            {typeof dados.precoOriginal === 'number' && dados.precoOriginal > (dados.preco ?? 0) && (
              <p className="preco-antigo">
                de: <span className="valor-antigo">{formatBRL(dados.precoOriginal)}</span>
              </p>
            )}

            <p className="preco-principal-container">
              por: <span className="preco-principal">{formatBRL(dados.preco)}</span>
              {dados.descontoPercentual > 0 && (
                <span className="desconto-tag">{dados.descontoPercentual}% OFF</span>
              )}
            </p>

            {dados.parcelas?.qtd && dados.parcelas?.valor && (
              <p className="parcelas">
                ou em até <strong>{dados.parcelas.qtd}x de {formatBRL(dados.parcelas.valor)}</strong> sem juros
              </p>
            )}
          </div>

          <div className="compra-opcoes">

            <div className="quantidade-selector ">
              <span>Quantidade:</span>
              {/* 2. CONTROLAR O VALOR DO SELECT COM O ESTADO */}
              <select value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            <button className="adicionar-sacola-btn" onClick={handleSaveClick}>Adicionar à sacola</button>
            <button className="comprar-agora-btn">Comprar Agora</button>

          </div>

          <div className="frete-calc-container">
            <p>Calcular frete:</p>
            <div className="frete-input-wrapper">
              <input type="text" placeholder="Insira o CEP" className="frete-input" />
            </div>
          </div>

          <div className="vendedor-info">
            <p><strong>Vendido por:</strong> Loja Brigadeiro</p>
            <p>Av Brigadeiro Luis Antônio, 2000 - Bela Vista, São Paulo - SP</p>
            <p>Referência OEM: {dados.familia?.descricao}</p>
          </div>
        </div>
      </div>

      {/* Seção de Informações do Produto */}
      <div className="produto-informacoes-adicionais">
        <h2 className="secao-titulo-tabela">Mais Informações</h2>

        <div className="produto-tabela-info">
          <div className="produto-tabela-titulo"><span>{dados.nomeProduto}</span></div>
          <div className="tabela-descricao-geral">
            <p>
              Desenvolvida para discos ventilados, esta pastilha de freio em cerâmica oferece frenagens mais suaves e silenciosas,
              com menos acúmulo de poeira nas rodas. Sua formulação garante alta durabilidade e resistência ao calor,
              mantendo a performance e segurança do seu veículo.
            </p>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Família</div>
            <div className="tabela-valor">{dados.familia?.descricao}</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">SubFamília</div>
            <div className="tabela-valor">{dados.familia?.subFamiliaDescricao}</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Marca</div>
            <div className="tabela-valor">{dados.marca}</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Código de identificação</div>
            <div className="tabela-valor">{dados.id}</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Modelo</div>
            <div className="tabela-valor">-{dados.modelo}</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Tipo de Veículo</div>
            <div className="tabela-valor">-</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Prazo garantia</div>
            <div className="tabela-valor">6 Meses</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Tipo de Aplicação</div>
            <div className="tabela-valor">PEÇAS</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Cor do Produto</div>
            <div className="tabela-valor">Não</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Largura</div>
            <div className="tabela-valor">-{dados.dimensoes}</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Altura</div>
            <div className="tabela-valor">-{dados.altura}</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Peso</div>
            <div className="tabela-valor">-{dados.peso}</div>
          </div>

          <div className="tabela-linha">
            <div className="tabela-label">Comprimento</div>
            <div className="tabela-valor">-{dados.comprimento}</div>
          </div>
        </div>
      </div>

      {/* Seção de Modelos Compatíveis */}
      <div className="item-aplicacoes">
        <h2 className="secao-titulo">Modelos Compatíveis</h2>
        <div className="aplicacoes-carousel-wrapper">
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