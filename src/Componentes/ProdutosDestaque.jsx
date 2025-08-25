// src/Paginas/ProdutosDestaque.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "/public/style/produtosDestaque.scss";

const API_URL = "http://127.0.0.1:5000";

function ProdutosDestaque({ handleLinhaClick }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/produtos`, {
      params: { query: "disco de freio" } // 🔥 aqui você fixa o termo
    })
      .then((res) => setProdutos(res.data || []))
      .catch((err) => console.error("Erro ao carregar destaques:", err));
  }, []);


  if (!produtos.length) return null;

  return (
    <div className="produtos-destaque">
      <h2>Destaques</h2>
      <div className="destaque-grid">
        {produtos.map((item) => (
          <div
            key={item.id}
            className="produto-card"
            onClick={() => handleLinhaClick(item)}
          >
            <img src={item.imagemReal} alt={item.nome} />
            <h3>{item.nome}</h3>
            <p><strong>Marca:</strong> {item.marca}</p>
            <p><strong>Preço:</strong> R$ {item.preco}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProdutosDestaque;
