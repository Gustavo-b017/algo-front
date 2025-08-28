import "../../public/style/tabela.css"
import React, { useEffect, useState } from "react";
import axios from "axios";

// usa a mesma URL da sua Home; se tiver .env, pega de lá
const API_URL = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:5000";

function ProdutoDestaque({ handleLinhaClick, titulo = "Destaques: Discos de Freio" }) {
  const [itens, setItens] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const buscarDestacados = async (p = 1) => {
    setCarregando(true);
    try {
      const params = new URLSearchParams({
        pagina: String(p),
        termo: "disco de freio", // 🔒 query fixa
        placa: "",
        marca: "",
        ordem: "asc",
      });
      const res = await axios.get(`${API_URL}/pesquisar?${params.toString()}`);

      setItens(res.data?.dados || []);
      setPagina(res.data?.pagina || p);
      setTotalPaginas(res.data?.total_paginas || 1);
      setMensagem(res.data?.mensagem || "");
    } catch (err) {
      console.error("Erro ao carregar destaques:", err);
      setItens([]);
      setMensagem("Erro ao carregar destaques.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDestacados(1); // carrega assim que o componente monta
  }, []);

  if (carregando) {
    return (
      <div className="tabela-carregando">
        <h1>Carregando destaques...</h1>
      </div>
    );
  }

  if (!itens.length) {
    // Se preferir não mostrar nada, troque por "return null;"
    return (
      <div className="tabela-carregando">
        <h1>{mensagem || "Nenhum destaque encontrado."}</h1>
      </div>
    );
  }

  const temMaisPaginas = pagina < totalPaginas;

  return (
    <section style={{ margin: "32px 0" }}>
      <h2 style={{ margin: "0 0 16px" }}>{titulo}</h2>

      <div className="cards-grid">
        {itens.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="produto-card"
            onClick={() => handleLinhaClick?.(item)}
            role="button"
          >
            <img src={item.imagemReal} alt={item.nome} className="produto-imagem" />
            <h3>{item.nome}</h3>
            <p><strong>Marca:</strong> {item.marca}</p>
            <p><strong>Potência:</strong> {item.potencia}</p>
            <p><strong>Ano Início:</strong> {item.ano_inicio}</p>
            <p><strong>Ano Fim:</strong> {item.ano_fim}</p>
          </div>
        ))}
      </div>

      {/* Controles de paginação (opcional) */}
      <div className="tabela-controle">
        <button
          disabled={pagina === 1}
          onClick={() => buscarDestacados(pagina - 1)}
        >
          {"<"} Voltar
        </button>

        <div className="paginacao-info">
          Página {pagina} de {totalPaginas}
        </div>

        <button
          className="botao-proximo"
          disabled={!temMaisPaginas}
          onClick={() => buscarDestacados(pagina + 1)}
        >
          Próxima {">"}
        </button>
      </div>
    </section>
  );
}

export default ProdutoDestaque;
