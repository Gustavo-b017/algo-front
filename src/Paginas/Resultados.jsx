// src/Paginas/Resultados.jsx
// -----------------------------------------------------------------------------
// Página de Lista de Resultados / Busca
// Objetivo:
// - Ler parâmetros de URL (termo, placa, família, subfamília, marca, ordenação,
//   página) e consultar o backend para obter a lista paginada.
// - Disponibilizar filtros em cascata (Família → Subfamília) e facetas (marcas).
// - Exibir a coleção de produtos, com suporte a Quick Add no carrinho.
// - Sincronizar estado da UI com a URL para permitir compartilhamento de links.
//
// Convenções de integração:
// - As consultas usam a API do backend (VITE_API_URL). Em dev, um token opcional
//   (VITE_API_TOKEN) pode ser enviado no header Authorization (Bearer ...).
// - O mapeamento de ordenação UI ↔ parâmetros de API é centralizado em
//   mapOrdenacaoToParams / mapParamsToUI.
// - A função fetchFacetas consulta /facetas-produto e consolida marcas e
//   subprodutos válidos para o contexto da família/subfamília selecionadas.
//
// Estados principais:
// - Filtros de URL (termo/placa/família/subfamília/marca/ordenar/página).
// - Listas para os controles (famílias, subfamílias, marcas) e indicadores
//   de carregamento (carregandoCascata/carregandoSubFamilias/carregandoFacetas).
// - Resultados paginados (resultados/paginaAtual/totalPaginas) e mensagem de
//   feedback do backend (feedbackMessage).
//
// UX/Responsividade:
// - Em telas pequenas, o painel de filtros vira um off-canvas; o corpo recebe
//   a classe no-scroll enquanto o painel está aberto.
// - A listagem já nasce em 1 coluna (mobile-first); no desktop, CSS alterna
//   para 3 colunas.
//
// Manutenção:
// - O componente foi mantido fiel ao original; apenas comentários explicativos
//   foram adicionados.
// - Para evoluções, preserve o contrato de URLSearchParams e os nomes dos campos
//   esperados pelo backend.
// -----------------------------------------------------------------------------

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../contexts/auth-context.jsx";
import Header from "../Componentes/Header.jsx";
import Categorias from "../Componentes/Categorias.jsx";
import Filtro from "../Componentes/Filtro.jsx";
import CardsProdutos from "../Componentes/CardsProdutos.jsx";
import Footer from "../Componentes/Footer.jsx";
import CartNotification from '../Componentes/CartNotification.jsx';
import { cartAdd } from "../lib/api.js";

import "/public/style/Resultados.scss";

// Base de API (fornecida via .env) e token opcional para ambientes de dev
const API_URL = import.meta.env.VITE_API_URL;

// token opcional (se tiver o decorator ativo em dev/prod)
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
if (API_TOKEN) axios.defaults.headers.common["Authorization"] = `Bearer ${API_TOKEN}`;

// ---------- Mapeamentos de ordenação UI ↔ API --------------------------------
// UI -> params da API
const mapOrdenacaoToParams = (uiValue, ascDesc) => {
  // ascDesc: 'asc' | 'desc'
  switch (uiValue) {
    case "relevancia":
      return { ordenar_por: "score", ordem: ascDesc || "desc" };
    case "menor-preco":
      return { ordenar_por: "preco", ordem: "asc" };
    case "maior-preco":
      return { ordenar_por: "preco", ordem: "desc" };
    case "melhor-avaliacao":
      return { ordenar_por: "avaliacao", ordem: ascDesc || "desc" };
    case "nome":
      return { ordenar_por: "nome", ordem: ascDesc || "asc" };
    default:
      return { ordenar_por: "score", ordem: "desc" };
  }
};

// params -> UI
const mapParamsToUI = (ordenar_por, ordem) => {
  if (ordenar_por === "preco" && ordem === "asc") return "menor-preco";
  if (ordenar_por === "preco" && ordem === "desc") return "maior-preco";
  if (ordenar_por === "avaliacao") return "melhor-avaliacao";
  if (ordenar_por === "nome") return "nome";
  return "relevancia"; // score/vendidos etc caem aqui
};

export default function Resultados() {
  // ----------------------------------------------------------------------------
  // Leitura/controle de parâmetros de URL e estados de filtro/ordenação/página
  // ----------------------------------------------------------------------------
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, fetchCartCount, triggerLoginAlert } = useAuth();

  const [notification, setNotification] = useState({
    isVisible: false,
    data: null,
  });

  // ------- URL state -------
  const [query, setQuery] = useState(searchParams.get("termo") || "");
  const [placa, setPlaca] = useState(searchParams.get("placa") || "");

  // filtros hierárquicos
  const [listaFamilias, setListaFamilias] = useState([]);
  const [listaSubFamilias, setListaSubFamilias] = useState([]);

  const [familiaSelecionada, setFamiliaSelecionada] = useState({
    id: searchParams.get("familia_id") || "",
    nome: searchParams.get("familia_nome") || "",
  });
  const [subFamiliaSelecionada, setSubFamiliaSelecionada] = useState({
    id: searchParams.get("subfamilia_id") || "",
    nome: searchParams.get("subfamilia_nome") || "",
  });

  // facetas (apenas o que existe)
  const [listaMarcasProduto, setListaMarcasProduto] = useState([]);
  const [marcaProdutoSelecionada, setMarcaProdutoSelecionada] = useState(
    searchParams.get("marca") || ""
  );

  // ordenação
  const ordenar_por_ini = searchParams.get("ordenar_por") || "score";
  const ordem_ini = searchParams.get("ordem") || "desc";
  const [ordenacaoUI, setOrdenacaoUI] = useState(
    mapParamsToUI(ordenar_por_ini, ordem_ini)
  );
  const [ordemUI, setOrdemUI] = useState(ordem_ini);

  // paginação / resultados
  const [resultados, setResultados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(
    parseInt(searchParams.get("pagina") || "1", 10)
  );
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [carregandoTabela, setCarregandoTabela] = useState(false);

  // carregando listas/facetas
  const [carregandoCascata, setCarregandoCascata] = useState(false);
  const [carregandoSubFamilias, setCarregandoSubFamilias] = useState(false);
  const [carregandoFacetas, setCarregandoFacetas] = useState(false);

  // Responsividade (off-canvas de filtros no mobile)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isMobile && showFilters);
  }, [isMobile, showFilters]);

  // -------- Carregar famílias na montagem -------------------------------------
  useEffect(() => {
    (async () => {
      setCarregandoCascata(true);
      try {
        const [resFamilias] = await Promise.all([axios.get(`${API_URL}/familias`)]);
        setListaFamilias(resFamilias.data || []);
      } catch (e) {
        console.error("Erro ao carregar famílias", e);
      } finally {
        setCarregandoCascata(false);
      }
    })();
  }, []);

  // -------- Subfamílias "cruas" ao mudar família ------------------------------
  useEffect(() => {
    const famId = familiaSelecionada.id;
    if (!famId) {
      setListaSubFamilias([]);
      setSubFamiliaSelecionada({ id: "", nome: "" });
      return;
    }
    setCarregandoSubFamilias(true);
    axios
      .get(`${API_URL}/familias/${famId}/subfamilias`)
      .then((res) => setListaSubFamilias(res.data || []))
      .catch((err) => console.error("Erro subfamílias:", err))
      .finally(() => setCarregandoSubFamilias(false));
  }, [familiaSelecionada.id]);

  // -------- Facetas (marcas + subprodutos válidos) ----------------------------
  const fetchFacetas = async (famId, famNome, subId) => {
    if (!famId || !famNome) {
      setListaMarcasProduto([]);
      return;
    }
    setCarregandoFacetas(true);
    try {
      const params = new URLSearchParams();
      params.set("familia_id", String(famId));
      params.set("familia_nome", famNome);
      if (subId) params.set("subfamilia_id", String(subId));
      const { data } = await axios.get(`${API_URL}/facetas-produto?${params.toString()}`);

      // marcas
      const marcas = (data?.marcas || []).map((m) => ({
        nome: m.nome,
        count: m.qtd,
      }));
      setListaMarcasProduto(marcas);

      // subprodutos válidos (se vierem, substituem a lista "crua")
      const subsValidos = (data?.subprodutos || []).map((s) => ({
        id: s.id,
        nome: s.nome,
        count: s.qtd,
      }));
      if (subsValidos.length) setListaSubFamilias(subsValidos);
    } catch (e) {
      console.error("Erro facetas:", e);
    } finally {
      setCarregandoFacetas(false);
    }
  };

  // Buscar facetas quando família/sub mudar
  useEffect(() => {
    if (!familiaSelecionada.id || !familiaSelecionada.nome) return;
    fetchFacetas(familiaSelecionada.id, familiaSelecionada.nome, subFamiliaSelecionada.id);
  }, [familiaSelecionada.id, familiaSelecionada.nome, subFamiliaSelecionada.id]);

  // -------- Busca principal (dados paginados) ---------------------------------
  useEffect(() => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    // Dispara se houver termo OU (família + nome)
    const hasTermo = !!paramsObj.termo;
    const hasFamilia = !!paramsObj.familia_id && !!paramsObj.familia_nome;

    if (!hasTermo && !hasFamilia) {
      setResultados([]);
      setTotalPaginas(1);
      setPaginaAtual(1);
      setFeedbackMessage("");
      return;
    }

    setCarregandoTabela(true);
    axios
      .get(`${API_URL}/pesquisar`, { params: paramsObj })
      .then((res) => {
        setResultados(res.data?.dados || []);
        setPaginaAtual(res.data?.pagina || 1);
        setTotalPaginas(res.data?.total_paginas || 1);
        setFeedbackMessage(res.data?.mensagem || "");
      })
      .catch((err) => console.error("Erro na busca:", err))
      .finally(() => setCarregandoTabela(false));
  }, [searchParams]);

  // ===== Handlers (ordenar/filtros/paginação/busca) ===========================

  // ordenação (UI → URL params → backend)
  const handleOrdenacaoChange = (novaOrdenacaoUI, novaOrdemUI) => {
    const { ordenar_por, ordem } = mapOrdenacaoToParams(novaOrdenacaoUI, novaOrdemUI);
    setOrdenacaoUI(novaOrdenacaoUI);
    setOrdemUI(ordem);

    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("ordenar_por", ordenar_por);
      p.set("ordem", ordem);
      p.set("pagina", "1");
      return p;
    });
  };

  // família
  const handleFamiliaChange = (id, nome) => {
    // Zera sub e marca ao mudar a família
    setFamiliaSelecionada({ id, nome });
    setSubFamiliaSelecionada({ id: "", nome: "" });
    setMarcaProdutoSelecionada("");

    if (id && nome) {
      const { ordenar_por, ordem } = mapOrdenacaoToParams(ordenacaoUI, ordemUI);
      setSearchParams({
        familia_id: String(id),
        familia_nome: nome,
        pagina: "1",
        ordenar_por,
        ordem,
      });
    } else {
      // Limpo: remove filtros/família da URL
      setSearchParams({});
    }
  };

  // subfamília
  const handleSubFamiliaChange = (id, nome) => {
    setSubFamiliaSelecionada({ id, nome });
    setMarcaProdutoSelecionada("");
    const { ordenar_por, ordem } = mapOrdenacaoToParams(ordenacaoUI, ordemUI);

    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (id) {
        p.set("subfamilia_id", String(id));
        p.set("subfamilia_nome", nome);
      } else {
        p.delete("subfamilia_id");
        p.delete("subfamilia_nome");
      }
      p.set("pagina", "1");
      p.set("ordenar_por", ordenar_por);
      p.set("ordem", ordem);
      return p;
    });
  };

  // marca (fabricante)
  const handleMarcaProdutoChange = (nomeMarca) => {
    setMarcaProdutoSelecionada(nomeMarca);
    const { ordenar_por, ordem } = mapOrdenacaoToParams(ordenacaoUI, ordemUI);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (nomeMarca) p.set("marca", nomeMarca.toUpperCase());
      else p.delete("marca");
      p.set("pagina", "1");
      p.set("ordenar_por", ordenar_por);
      p.set("ordem", ordem);
      return p;
    });
  };

  // paginação
  const handlePageChange = (pagina) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("pagina", String(pagina));
      return p;
    });
  };

  // busca pelo cabeçalho
  const handleSearchSubmit = (termo, placaVal) => {
    const { ordenar_por, ordem } = mapOrdenacaoToParams(ordenacaoUI, ordemUI);
    const params = new URLSearchParams();
    if (termo) params.set("termo", termo);
    if (placaVal) params.set("placa", placaVal.toUpperCase());
    params.set("pagina", "1");
    params.set("ordenar_por", ordenar_por);
    params.set("ordem", ordem);
    navigate(`/resultados?${params.toString()}`);
  };

  // clique em categoria (atalho para iniciar uma busca por termo)
  const handleCategoryClick = (categoryName) => {
    const params = new URLSearchParams({ termo: categoryName });
    navigate(`/resultados?${params.toString()}`);
  };

  // Limpa todos os filtros mantendo, se existirem, termo e placa
  const handleClearAllFilters = () => {
    // 1. Limpa os estados de filtro
    setFamiliaSelecionada({ id: "", nome: "" });
    setSubFamiliaSelecionada({ id: "", nome: "" });
    setMarcaProdutoSelecionada("");

    // 2. Limpa os parâmetros de filtro da URL, mantendo apenas o termo/placa
    setSearchParams((prev) => {
      const p = new URLSearchParams();
      if (prev.get("termo")) p.set("termo", prev.get("termo"));
      if (prev.get("placa")) p.set("placa", prev.get("placa"));
      p.set("pagina", "1");
      p.set("ordenar_por", "score");
      p.set("ordem", "desc");
      return p;
    });
  };

  // ===== Quick Add (botão de carrinho em cards) ===============================
  const handleQuickAdd = async (produto) => {
    // 1) Autenticação obrigatória
    if (!user) {
      triggerLoginAlert();
      return;
    }

    // 2) Monta payload esperado pelo backend
    const itemToAdd = {
      id_api_externa: produto.id,
      nome: produto.nome,
      codigo_referencia: produto.codigoReferencia || produto.id,
      url_imagem: produto.imagemReal,
      preco_original: produto.precoOriginal,
      preco_final: produto.preco,
      desconto: produto.descontoPercentual,
      marca: produto.marca,
      quantidade: 1 // Quick Add adiciona apenas 1
    };

    // 3) Chama a API e sincroniza contador + notificação
    try {
      await cartAdd(itemToAdd);
      fetchCartCount(); // atualiza o badge do Header

      setNotification({
        isVisible: true,
        data: { ...itemToAdd, nomeProduto: itemToAdd.nome }
      });

    } catch (error) {
      console.error("Erro ao adicionar item rápido:", error);
      alert("Não foi possível adicionar o item. Tente novamente.");
    }
  };

  // ----------------------------------------------------------------------------
  // Renderização
  // ----------------------------------------------------------------------------
  return (
    <div className="container">
      <Header
        query={query}
        setQuery={setQuery}
        placa={placa}
        setPlaca={setPlaca}
        onSearchSubmit={handleSearchSubmit}
      />

      <Categorias onCategoryClick={handleCategoryClick} />

      {/* BOTÃO FILTROS (visível só no mobile via CSS) */}
      <div className="filters-mobile-bar">
        <button
          type="button"
          className="btn-open-filters"
          onClick={() => setShowFilters(true)}
        >
          Filtros
        </button>
      </div>

      {/* BACKDROP + PAINEL LATERAL (só mobile) */}
      {isMobile && showFilters && <div className="modal-backdrop" onClick={() => setShowFilters(false)} />}
      {isMobile && (
        <Filtro
          /* mesmas props que o sidebar */
          ordenacaoAtual={ordenacaoUI}
          ordemAtual={ordemUI}
          onOrdenacaoChange={handleOrdenacaoChange}
          listaFamilias={listaFamilias}
          familiaSelecionada={familiaSelecionada}
          onFamiliaChange={handleFamiliaChange}
          listaSubFamilias={listaSubFamilias}
          subFamiliaSelecionada={subFamiliaSelecionada}
          onSubFamiliaChange={handleSubFamiliaChange}
          carregandoCascata={carregandoCascata}
          carregandoSubFamilias={carregandoSubFamilias}
          listaMarcasProduto={listaMarcasProduto}
          marcaProdutoSelecionada={marcaProdutoSelecionada}
          onMarcaProdutoChange={handleMarcaProdutoChange}
          carregandoFacetas={carregandoFacetas}
          className={showFilters ? "visivel" : ""}   // <<< abre o off-canvas
          onClose={() => setShowFilters(false)}
        />
      )}

      <main className="search-page-container">
        {/* SIDEBAR (só desktop) */}
        {!isMobile && (
          <aside className="filters-sidebar">
            <Filtro
              ordenacaoAtual={ordenacaoUI}
              ordemAtual={ordemUI}
              onOrdenacaoChange={handleOrdenacaoChange}
              listaFamilias={listaFamilias}
              familiaSelecionada={familiaSelecionada}
              onFamiliaChange={handleFamiliaChange}
              listaSubFamilias={listaSubFamilias}
              subFamiliaSelecionada={subFamiliaSelecionada}
              onSubFamiliaChange={handleSubFamiliaChange}
              carregandoCascata={carregandoCascata}
              carregandoSubFamilias={carregandoSubFamilias}
              listaMarcasProduto={listaMarcasProduto}
              marcaProdutoSelecionada={marcaProdutoSelecionada}
              onMarcaProdutoChange={handleMarcaProdutoChange}
              carregandoFacetas={carregandoFacetas}
              className="pretty"
            />
          </aside>
        )}

        {/* LISTA – por padrão já é 1 coluna; desktop vira 3 colunas */}
        <section className="search-results">
          <CardsProdutos
            resultados={resultados}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            buscarTratados={handlePageChange}
            carregandoTabela={carregandoTabela}
            feedbackMessage={feedbackMessage}
            handleLinhaClick={(p) => {
              const params = new URLSearchParams({ id: p.id, nomeProduto: p.nome });
              navigate(`/produto?${params.toString()}`);
            }}
            handleQuickAdd={handleQuickAdd} // NOVO: Passa a função de Quick Add
            actionText="Limpar Filtros Aplicados"
            onActionClick={handleClearAllFilters}
          />
        </section>
      </main>

      <Footer />

      {/* Notificação visual de “adicionado ao carrinho” */}
      <CartNotification
        isVisible={notification.isVisible}
        onClose={() => setNotification(v => ({ ...v, isVisible: false }))}
        productData={notification.data}
      />
    </div>
  );
}
