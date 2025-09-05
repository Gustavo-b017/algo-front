// src/Componentes/ProdutoDestaque.jsx
import "/public/style/produtoDestaque.scss"
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import arrow_left from "/public/imagens/icones/arrow-left.png";
import arrow_right from "/public/imagens/icones/arrow-right.png";

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';


// INFORMAÇÃO EDITAVEIS
const TagMenssage = "-15% OFF";

function ProdutoDestaque({ handleLinhaClick, produtoDestaque }) {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const carouselRef = useRef(null);

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
      <div className="empty-state-container">
        <h1>Nenhum resultado encontrado...</h1>
      </div>
    );
  }

  return (
    <section className="produtos-destaque">
      <h2 className="destaque-titulo">{produtoDestaque}</h2>

      <div className="carousel-container">
        <button className="carousel-arrow left" onClick={() => scrollCarousel("left")}>
          <img src={arrow_left} alt="Arrow left icon" />
        </button>
        <div className="carousel-items" ref={carouselRef}>
          {itens.map((item) => (
            <div key={item.id} className="produto-card-detaque" onClick={() => handleLinhaClick?.(item)}>
              <div className="tag-message">{TagMenssage}</div>
              <img src={item.imagemReal} alt={item.nome} className="produto-img-destaque" />
              <div className="produto-info">
                <p className="produto-nome">{item.nome}</p>
                <div className="precos">
                  <p className="preco-antigo">De: R$ 500,00{item.precoAntigo}</p>
                  <p className="preco-novo">
                    Por: <span className="preco-principal">R$ 499,99{item.precoNovo}</span> no Pix
                  </p>
                  <p className="preco-parcelado">ou em até 10x de R$50,00</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-arrow right" onClick={() => scrollCarousel("right")}>
          <img src={arrow_right} alt="Arrow right icon" />
        </button>
      </div>
    </section>
  );
}

export default ProdutoDestaque;