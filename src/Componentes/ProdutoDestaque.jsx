// src/Componentes/ProdutoDestaque.jsx
import "/public/style/produtoDestaque.scss";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import arrow_left from "/public/imagens/icones/arrow-left.png";
import arrow_right from "/public/imagens/icones/arrow-right.png";
import carrinho_icon from '/public/imagens/icones/carrinho.svg';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

const formatBRL = (v) =>
  typeof v === 'number' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

function ProdutoDestaque({ handleLinhaClick, produtoDestaque, handleQuickAdd }) {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const buscarDestacados = async () => {
    setCarregando(true);
    try {
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
      console.error("Erro ao carregar destaques:", err);
      setItens([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDestacados();
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Ajuste este valor para controlar a quantidade de rolagem
      if (direction === "left") {
        carouselRef.current.scrollLeft -= scrollAmount;
      } else {
        carouselRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  if (carregando) {
    return (
      <div className="loader-container">
        <div className="loader-circle"></div>
        <p className="notive_load">Carregando...</p>
      </div>
    );
  }

  if (!itens.length) {
    return (
      <section className="produtos-destaque">
        <h2 className="destaque-titulo">{produtoDestaque}</h2>
        {/* Reusa a classe estilizada em notificacoes.scss */}
        <div className="empty-state-container" style={{ maxWidth: '90%' }}>
          <h1>Nenhum destaque de "{produtoDestaque}" encontrado.</h1>
          <p>Não foi possível carregar produtos para esta categoria no momento. Tente navegar pelo catálogo completo.</p>
          <button
            className="empty-state-action-btn"
            onClick={() => navigate("/resultados")} // Leva para a página de resultados
            aria-label="Ver Catálogo Completo"
          >
            Ver Catálogo Completo
          </button>
        </div>
      </section>
    );
  }

  // Limita a exibição de itens para 4 no mobile
  const itensParaExibir = window.innerWidth < 768 ? itens.slice(0, 4) : itens;

  return (
    <section className="produtos-destaque">
      <h2 className="destaque-titulo">{produtoDestaque}</h2>

      <div className="carousel-container">
        <button className="carousel-arrow left" onClick={() => scrollCarousel("left")}>
          <img src={arrow_left} alt="Arrow left icon" />
        </button>
        <div className="carousel-items" ref={carouselRef}>
          {itensParaExibir.map((item) => (
            <div key={item.id} className="produto-card-destaque">

              {/* Container principal para clique na linha */}
              <div onClick={() => handleLinhaClick?.(item)}>

                {/* TAG MESSAGE */}
                {item.descontoPercentual > 0 && (
                  <span className="tag-message">{item.descontoPercentual}% OFF</span>
                )}

                {/* iMAGEM */}
                <img src={item.imagemReal} alt={item.nome} className="produto-img-destaque" />

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
                    <p className="preco-parcelado">ou em até 10x de R$50,00</p>
                  </div>
                </div>
              </div>

              {/* Botão de Quick Add */}
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
        <button className="carousel-arrow right" onClick={() => scrollCarousel("right")}>
          <img src={arrow_right} alt="Arrow right icon" />
        </button>
      </div>
    </section >
  );
}

export default ProdutoDestaque;