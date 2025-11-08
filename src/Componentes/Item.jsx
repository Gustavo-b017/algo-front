// src/Paginas/Item.jsx
// ============================================================================
// Componente: Item
// ----------------------------------------------------------------------------
// Objetivo
// - Página de detalhes do produto: exibe informações completas, variações de
//   preço e permite ao usuário adicionar o item ao carrinho.
//
// Diretrizes arquiteturais (alinhadas ao back):
// - Responsabilidade única: renderização de UI e coleta de inputs (quantidade).
//   A gravação no carrinho é delegada via prop `onSave` (contrato de dados).
// - Interoperabilidade front/back: o payload enviado em `onSave(...)` segue o
//   contrato do endpoint /salvar_produto do back (chaves e tipos esperados).
// - Segurança/Autenticação: antes de salvar, verifica sessão (useAuth). Caso
//   não esteja autenticado, dispara um alerta/CTA (triggerLoginAlert) em vez de
//   chamar o back sem credenciais.
// - UX/Acessibilidade: textos alternativos em imagens, fallback de estados,
//   labels claros e formatação local de moeda (pt-BR).
// - Manutenção/Performance: funções utilitárias puras (formatBRL/formatScore),
//   estado mínimo (quantidade/hover) e sem efeitos colaterais inesperados.
// ============================================================================

import React, { useState } from 'react';
import '/public/style/item.scss';
import { useAuth } from '../contexts/auth-context';
import { useNavigate } from 'react-router-dom'; 
import StarRating from './StarRating';

// ---------------------------------------------------------------------------
// Utilitários de formatação (somente apresentação)
// - formatBRL: converte número para BRL com locale pt-BR
// - formatScore: assegura 3 casas decimais quando score é numérico
// ---------------------------------------------------------------------------
const formatBRL = (v) =>
  typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

const formatScore = (s) =>
  typeof s === 'number' && Number.isFinite(s) ? s.toFixed(3) : null;

function Item({ dadosItem, onSave }) {
  // hoverIndex: controla o “card” de aplicação destacado (efeito hover)
  // quantidade: quantidade selecionada para adicionar ao carrinho
  const [hoverIndex, setHoverIndex] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  // Contexto de autenticação para gate de ações protegidas (salvar/comprar)
  const { user, triggerLoginAlert } = useAuth(); 
  const navigate = useNavigate(); // Mantido para eventuais navegações futuras

  // Guard-clause: caso o item não esteja disponível, evita quebras e informa o usuário
  if (!dadosItem) {
    return <div className="empty-state-container"><h1>Informações do item não disponíveis.</h1></div>;
  }

  // Alias semântica para clareza no template
  const dados = dadosItem;

  // -------------------------------------------------------------------------
  // Fluxo “Adicionar à sacola”
  // 1) Verifica autenticação; se ausente, exibe CTA de login/cadastro (toast).
  // 2) Em caso de sessão válida, monta o payload compatível com /salvar_produto:
  //    {
  //      id_api_externa, nome, codigo_referencia, url_imagem,
  //      preco_original, preco_final, desconto, marca, quantidade
  //    }
  // 3) Delega a persistência ao callback `onSave`, que deve consumir a API.
  // -------------------------------------------------------------------------
  const handleSaveClick = () => {
    if (!user) {
      // Garante que ações de carrinho só ocorram autenticadas
      triggerLoginAlert();
      return;
    }

    // Contrato com o back (/salvar_produto) — chaves e tipos esperados:
    onSave({
      id_api_externa: dados.id,
      nome: dados.nomeProduto,
      codigo_referencia: dados.codigoReferencia,
      url_imagem: dados.imagemReal,
      preco_original: dados.precoOriginal,
      preco_final: dados.preco,
      desconto: dados.descontoPercentual,
      marca: dados.marca,
      quantidade: quantidade
    });
  };

  return (
    <div className="item-page-container">
      {/* ------------------------------------------------------------------- */}
      {/* Seção Principal (grid): galeria à esquerda, informações à direita   */}
      {/* ------------------------------------------------------------------- */}
      <div className="produto-main-section">

        {/* ----------------------- Galeria de Imagens ----------------------- */}
        {/* Mantém uma imagem principal e miniaturas (thumbnails).            */}
        {/* Sobreposições de “vídeo” são meramente visuais (sem player).      */}
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
            {/* Reutiliza a mesma imagem como exemplo (mock); pode ser dinamizado futuramente */}
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

        {/* ------------------- Bloco de Informações/Compra ------------------ */}
        {/* Exibe título, rating, códigos, marca, preços e ações (comprar).   */}
        <div className="produto-info-section">
          <h1 className="produto-titulo">{dados.nomeProduto}</h1>

          <div className="produto-rating">
              {/* 
                - StarRating: componente visual baseado em `score`.
                - Aqui, `dados.score` é tratado como escala 0–12 (coerente com
                  o motor de relevância do back); o fallback `|| 0` evita NaN.
                - `totalReviews` é opcional; quando disponível, melhora a UX.
              */}
              <StarRating 
                score={dados.score || 0} 
                totalReviews={dados.totalAvaliacoes} // caso o campo exista
              />

              {/* Exposição opcional do score numérico (diagnóstico/UX avançada) */}
              {formatScore(dados.score) !== null && (
                <span
                  className="produto-score-badge"
                  title="Pontuação de relevância (0-12)"
                >
                  (Score: {formatScore(dados.score)})
                </span>
              )}
          </div>

          {/* Metadados do item (IDs/marca) para identificação e suporte */}
          <p className="produto-codigo">Código:{dados.id}</p>
          <p className="produto-marca">Marca: <strong>{dados.marca}</strong></p>

          {/* Preços: exibe “de/por” e parcelas quando disponíveis */}
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

          {/* Controles de compra: seleção de quantidade e call-to-actions */}
          <div className="compra-opcoes">
            <div className="quantidade-selector ">
              <span>Quantidade:</span>
              <select value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            {/* CTA protegido por autenticação (ver handleSaveClick) */}
            <button className="adicionar-sacola-btn" onClick={handleSaveClick}>Adicionar à sacola</button>
            <button className="comprar-agora-btn">Comprar Agora</button>
          </div>

          {/* Placeholder de cálculo de frete (somente UI) */}
          <div className="frete-calc-container">
            <p>Calcular frete:</p>
            <div className="frete-input-wrapper">
              <input type="text" placeholder="Insira o CEP" className="frete-input" />
            </div>
          </div>

          {/* Bloco informativo estático do vendedor (pode ser dinamizado futuramente) */}
          <div className="vendedor-info">
            <p><strong>Vendido por:</strong> Loja Brigadeiro</p>
            <p>Av Brigadeiro Luis Antônio, 2000 - Bela Vista, São Paulo - SP</p>
            <p>Referência OEM: {dados.familia?.descricao}</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Informações adicionais em tabela semântica (labels/valores)        */}
      {/* ------------------------------------------------------------------- */}
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

      {/* ------------------------------------------------------------------- */}
      {/* Modelos compatíveis (cards com hover para detalhes técnicos)        */}
      {/* ------------------------------------------------------------------- */}
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
