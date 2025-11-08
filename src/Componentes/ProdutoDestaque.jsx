// src/Componentes/ProdutoDestaque.jsx
// ============================================================================
// Componente: ProdutoDestaque
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir um carrossel horizontal com produtos “em destaque”, obtidos via
//   endpoint público de pesquisa do backend, com suporte a:
//   (a) navegação para a página do produto ao clicar no card;
//   (b) ação “Quick Add” opcional para adicionar 1 item ao carrinho;
//   (c) estado de carregamento e estado vazio com CTA para o catálogo.
//
// Diretrizes arquiteturais (alinhadas ao back)
// - Responsabilidade única (SRP): listar e renderizar destaques + acionar
//   callbacks de navegação/adição. Sem gerenciar carrinho ou autenticação.
// - Integração com API: usa GET /pesquisar (compatível com contrato do back).
//   Observação: aqui utiliza-se `axios` diretamente com `API_URL` por ser rota
//   pública; em projetos maiores, centralizar via instância `api` pode padronizar
//   headers/timeout e logs (mantendo esta decisão para evitar mudanças de
//   comportamento neste componente).
// - UX resiliente: loading spinner, fallback quando não há itens, botões
//   de rolagem do carrossel e limites responsivos no mobile.
// - Extensibilidade: comportamentos de clique e “quick add” são injetados via
//   props (`handleLinhaClick` e `handleQuickAdd`), mantendo o componente
//   desacoplado do domínio.
//
// Contrato de props
// - produtoDestaque: string — termo de busca para destacar (ex.: "pastilha").
// - handleLinhaClick?: function(item) — navegação ao detalhe do produto.
// - handleQuickAdd?: function(item) — adiciona 1 unidade ao carrinho.
//
// Observações importantes
// - Efeito de busca: o `useEffect` está com deps vazias (`[]`), logo a busca
//   roda apenas no primeiro mount. Se for desejável reconsultar a API quando
//   `produtoDestaque` mudar, adicione `produtoDestaque` no array de deps.
//   (Não alterado aqui para preservar o comportamento original.)
// - Responsividade: o recorte para mobile usa `window.innerWidth` no render;
//   para reagir a resize seria necessário listener (não implementado por
//   escolha intencional de simplicidade/estabilidade).
// - Acessibilidade: imagens têm `alt`; botões possuem `title`/`aria-label`.
// - Performance: a lista é simples; rolagem é por `scrollLeft` com passo
//   fixo. Em catálogos extensos, considere virtualização.
//
// Testes sugeridos
// - Renderização com loading e posterior exibição de cards.
// - Estado vazio e clique no CTA “Ver Catálogo Completo”.
// - Clique no card acionando `handleLinhaClick`.
// - Clique no botão de carrinho acionando `handleQuickAdd` sem propagar
//   o clique para o card (uso de `stopPropagation`).
// ============================================================================

import "/public/style/produtoDestaque.scss";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import arrow_left from "/public/imagens/icones/arrow-left.png";
import arrow_right from "/public/imagens/icones/arrow-right.png";
import carrinho_icon from '/public/imagens/icones/carrinho.svg';

// Base de API obtida via variáveis de ambiente (Vite).
// Mantém compatibilidade com o backend já configurado.
const API_URL = import.meta.env.VITE_API_URL;

// Utilitário local para formatar valores em BRL.
const formatBRL = (v) =>
  typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

function ProdutoDestaque({ handleLinhaClick, produtoDestaque, handleQuickAdd }) {
  // Estado local: itens destacados e flag de carregamento (UX).
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Ref para o contêiner scrollável do carrossel (controle imperativo de rolagem).
  const carouselRef = useRef(null);

  // Hook de navegação para o CTA do estado vazio.
  const navigate = useNavigate();

  // Busca os itens destacados a partir do termo `produtoDestaque`.
  // Mantida como função isolada para reuso (ex.: reconsulta manual futura).
  const buscarDestacados = async () => {
    setCarregando(true);
    try {
      // Monta a query de pesquisa conforme contrato do backend (/pesquisar).
      // Observação: enviamos apenas parâmetros relevantes para um destaque
      // genérico (página 1, termo, ordem DESC). `marca` e `placa` vazios.
      const params = new URLSearchParams({
        pagina: "1",
        termo: produtoDestaque,
        placa: "",
        marca: "",
        ordem: "desc",
      });
      const res = await axios.get(`${API_URL}/pesquisar?${params.toString()}`);
      setItens(res.data?.dados || []);
    } catch (err) {
      // Falha resiliente: loga erro e exibe estado vazio (itens = []).
      console.error("Erro ao carregar destaques:", err);
      setItens([]);
    } finally {
      setCarregando(false);
    }
  };

  // Efeito de montagem: carrega destaques uma única vez por mount.
  // Nota: se for necessário reagir a mudanças em `produtoDestaque`,
  // inclua-o no array de dependências.
  useEffect(() => {
    buscarDestacados();
  }, []);

  // Função utilitária para rolagem do carrossel (seta esquerda/direita).
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Passo de rolagem (px): ajuste conforme UX desejada.
      if (direction === "left") {
        carouselRef.current.scrollLeft -= scrollAmount;
      } else {
        carouselRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  // Estado de carregamento (spinner consistente com o restante do app).
  if (carregando) {
    return (
      <div className="loader-container">
        <div className="loader-circle"></div>
        <p className="notive_load">Carregando...</p>
      </div>
    );
  }

  // Estado vazio: mantém a hierarquia visual e apresenta CTA para o catálogo.
  if (!itens.length) {
    return (
      <section className="produtos-destaque">
        <h2 className="destaque-titulo">{produtoDestaque}</h2>
        {/* Reuso de estilos de empty state para padronização de UX. */}
        <div className="empty-state-container" style={{ maxWidth: '90%' }}>
          <h1>Nenhum destaque de "{produtoDestaque}" encontrado.</h1>
          <p>Não foi possível carregar produtos para esta categoria no momento. Tente navegar pelo catálogo completo.</p>
          <button
            className="empty-state-action-btn"
            onClick={() => navigate("/resultados")}
            aria-label="Ver Catálogo Completo"
          >
            Ver Catálogo Completo
          </button>
        </div>
      </section>
    );
  }

  // Heurística simples: no mobile exibe no máximo 4 itens para evitar overflow.
  // Observação: avalia `window.innerWidth` apenas no render atual (sem listener).
  const itensParaExibir = window.innerWidth < 768 ? itens.slice(0, 4) : itens;

  return (
    <section className="produtos-destaque">
      <h2 className="destaque-titulo">{produtoDestaque}</h2>

      <div className="carousel-container">
        {/* Controles de rolagem (acessíveis por ícone e clique). */}
        <button className="carousel-arrow left" onClick={() => scrollCarousel("left")}>
          <img src={arrow_left} alt="Arrow left icon" />
        </button>

        {/* Faixa rolável contendo os cards. */}
        <div className="carousel-items" ref={carouselRef}>
          {itensParaExibir.map((item) => (
            <div key={item.id} className="produto-card-destaque">

              {/* Wrapper clicável: delega navegação ao callback injetado por props. */}
              <div onClick={() => handleLinhaClick?.(item)}>

                {/* Tag de desconto (render condicional para ofertas). */}
                {item.descontoPercentual > 0 && (
                  <span className="tag-message">{item.descontoPercentual}% OFF</span>
                )}

                {/* Imagem do produto com alt descritivo. */}
                <img src={item.imagemReal} alt={item.nome} className="produto-img-destaque" />

                {/* Bloco de informações básicas: nome e preços. */}
                <div className="produto-info">
                  <p className="produto-nome">{item.nome}</p>
                  <div className="precos">
                    {typeof item.precoOriginal === 'number' && item.precoOriginal > (item.preco ?? 0) && (
                      <p className="preco-antigo">
                        <span>{formatBRL(item.precoOriginal)}</span>
                      </p>
                    )}
                    <p className="preco-novo">
                      Por: <span className="preco-principal">{formatBRL(item.preco)}</span> no Pix
                    </p>
                    {/* Valor parcelado estático (mantido conforme original). */}
                    <p className="preco-parcelado">ou em até 10x de R$50,00</p>
                  </div>
                </div>
              </div>

              {/* Ação “Quick Add”: impedimos a propagação para não navegar ao detalhe. */}
              {handleQuickAdd && (
                <button
                  className="add-carr-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd(item);
                  }}
                  title="Adicionar 1 item ao carrinho"
                >
                  <img src={carrinho_icon} alt="Ícone de carrinho" />
                </button>
              )}
            </div>

          ))}
        </div>

        {/* Controle de rolagem direita. */}
        <button className="carousel-arrow right" onClick={() => scrollCarousel("right")}>
          <img src={arrow_right} alt="Arrow right icon" />
        </button>
      </div>
    </section >
  );
}

export default ProdutoDestaque;
