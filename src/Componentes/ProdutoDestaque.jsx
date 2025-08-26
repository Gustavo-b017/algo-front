import React, { useEffect, useState } from "react";

const ProdutoDestaque = ({ buscarResultados }) => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const resposta = await buscarResultados({
          tipo: "texto",
          termo: "disco", // query fixa
          pagina: 1,
        });

        if (resposta && resposta.resultados) {
          setProdutos(resposta.resultados);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos destaque:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [buscarResultados]);

  if (carregando) {
    return <p>Carregando produtos em destaque...</p>;
  }

  if (!produtos || produtos.length === 0) {
    return <p>Nenhum produto em destaque encontrado.</p>;
  }

  return (
    <div className="produtos-destaque">
      <h2>Produtos em Destaque</h2>
      <div className="lista-destaque">
        {produtos.map((produto) => (
          <div key={produto.id} className="produto-card">
            <h3>{produto.nome}</h3>
            <p>{produto.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProdutoDestaque;
