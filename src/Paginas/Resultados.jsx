// src/Paginas/Resultados.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../Componentes/Header.jsx';
import Categorias from '../Componentes/Categorias.jsx';
import Filtro from '../Componentes/Filtro.jsx';
import CardsProdutos from '../Componentes/CardsProdutos.jsx';
import Footer from '../Componentes/Footer.jsx';
import '/public/style/resultados.scss';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://127.0.0.1:5000';


// default defensivo para direção
const defaultOrderFor = (ordenarPor) =>
  ordenarPor === 'menor_preco' ? 'asc' : 'desc';

function Resultados() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ------- Cascata -------
  const [listaMontadoras, setListaMontadoras] = useState([]);
  const [listaFamilias, setListaFamilias] = useState([]);
  const [listaSubFamilias, setListaSubFamilias] = useState([]);

  const [montadoraSelecionada, setMontadoraSelecionada] = useState({
    id: '',
    nome: searchParams.get('marca') || '',
  });
  const [familiaSelecionada, setFamiliaSelecionada] = useState({
    id: searchParams.get('familia_id') || '',
    nome: searchParams.get('familia_nome') || '',
  });
  const [subFamiliaSelecionada, setSubFamiliaSelecionada] = useState({
    id: searchParams.get('subfamilia_id') || '',
    nome: searchParams.get('subfamilia_nome') || '',
  });

  const [carregandoCascata, setCarregandoCascata] = useState(false);
  const [carregandoSubFamilias, setCarregandoSubFamilias] = useState(false);

  // ------- Resultados -------
  const [resultados, setResultados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(
    parseInt(searchParams.get('pagina') || '1', 10)
  );
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregandoTabela, setCarregandoTabela] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // ------- Ordenação -------
  const ordenarPorInit = searchParams.get('ordenar_por') || 'score';
  const ordemInit = searchParams.get('ordem') || defaultOrderFor(ordenarPorInit);
  const [ordenarPor, setOrdenarPor] = useState(ordenarPorInit);
  const [ordem, setOrdem] = useState(ordemInit);

  // ------- UI lateral -------
  const [showFilters, setShowFilters] = useState(false);

  // Load cascata
  useEffect(() => {
    async function carregarCascata() {
      setCarregandoCascata(true);
      try {
        const [resMontadoras, resFamilias] = await Promise.all([
          axios.get(`${API_URL}/montadoras`),
          axios.get(`${API_URL}/familias`),
        ]);
        setListaMontadoras(resMontadoras.data);
        setListaFamilias(resFamilias.data);
      } finally {
        setCarregandoCascata(false);
      }
    }
    carregarCascata();
  }, []);

  // Subfamílias
  useEffect(() => {
    const famId = familiaSelecionada.id;
    if (!famId) {
      setListaSubFamilias([]);
      return;
    }
    setCarregandoSubFamilias(true);
    setListaSubFamilias([]);
    axios
      .get(`${API_URL}/familias/${famId}/subfamilias`)
      .then((res) => setListaSubFamilias(res.data))
      .catch(() => {})
      .finally(() => setCarregandoSubFamilias(false));
  }, [familiaSelecionada.id]);

  // Busca principal reagindo à URL
  useEffect(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const params = {
      ...raw,
      ordenar_por: raw.ordenar_por || ordenarPorInit,
      ordem: raw.ordem || defaultOrderFor(raw.ordenar_por || ordenarPorInit),
    };

    if (ordenarPor !== params.ordenar_por) setOrdenarPor(params.ordenar_por);
    if (ordem !== params.ordem) setOrdem(params.ordem);

    const temBuscaLivre = !!params.termo;
    const temCascata = !!(params.marca && params.familia_id);

    if (temBuscaLivre || temCascata) {
      setCarregandoTabela(true);
      axios
        .get(`${API_URL}/pesquisar`, { params })
        .then((res) => {
          setResultados(res.data?.dados || []);
          setPaginaAtual(res.data?.pagina || 1);
          setTotalPaginas(res.data?.total_paginas || 1);
          setFeedbackMessage(res.data?.mensagem || '');
        })
        .catch(() => {})
        .finally(() => setCarregandoTabela(false));
    } else {
      setResultados([]);
      setPaginaAtual(1);
      setTotalPaginas(1);
      setFeedbackMessage('');
    }
  }, [searchParams]);

  // Helper que preserva ordenação
  const pushParams = (updater) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (!p.get('ordenar_por')) p.set('ordenar_por', ordenarPor || 'score');
      if (!p.get('ordem')) p.set('ordem', ordem || defaultOrderFor(ordenarPor));
      updater(p);
      return p;
    });
  };

  // Paginação
  const handlePageChange = (pagina) => {
    pushParams((p) => p.set('pagina', String(pagina)));
  };

  // Categoria → busca livre (preserva ordenação)
  const handleCategoryClick = (categoryName) => {
    const p = new URLSearchParams({
      termo: categoryName,
      ordenar_por: ordenarPor,
      ordem,
      pagina: '1',
    });
    navigate(`/resultados?${p.toString()}`);
  };

  // Cascata
  const handleMontadoraChange = (id, nome) => {
    setMontadoraSelecionada({ id, nome });
    setFamiliaSelecionada({ id: '', nome: '' });
    setSubFamiliaSelecionada({ id: '', nome: '' });
  };

  const handleFamiliaChange = (id, nome) => {
    setFamiliaSelecionada({ id, nome });
    setSubFamiliaSelecionada({ id: '', nome: '' });

    if (montadoraSelecionada.nome && id) {
      const p = new URLSearchParams({
        marca: montadoraSelecionada.nome,
        familia_id: id,
        familia_nome: nome,
        ordenar_por: ordenarPor,
        ordem,
        pagina: '1',
      });
      navigate(`/resultados?${p.toString()}`);
    }
  };

  const handleSubFamiliaChange = (id, nome) => {
    setSubFamiliaSelecionada({ id, nome });
    if (montadoraSelecionada.nome && familiaSelecionada.id) {
      const p = new URLSearchParams({
        marca: montadoraSelecionada.nome,
        familia_id: familiaSelecionada.id,
        familia_nome: familiaSelecionada.nome,
        ordenar_por: ordenarPor,
        ordem,
        pagina: '1',
        ...(id ? { subfamilia_id: id, subfamilia_nome: nome } : {}),
      });
      navigate(`/resultados?${p.toString()}`);
    }
  };

  // Ordenação (agora na sidebar)
  const onChangeOrdenarPor = (value) => {
    setOrdenarPor(value);
    pushParams((p) => {
      p.set('ordenar_por', value);
      if (!p.get('ordem')) p.set('ordem', defaultOrderFor(value));
      p.set('pagina', '1');
    });
  };
  const onChangeOrdem = (value) => {
    setOrdem(value);
    pushParams((p) => {
      p.set('ordem', value);
      p.set('pagina', '1');
    });
  };

  // Click card
  const handleLinhaClick = (produto) => {
    const p = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${p.toString()}`);
  };

  return (
    <div className="container">
      <Header />
      <Categorias onCategoryClick={handleCategoryClick} />

      <main className="search-page-container">
        <div className="opcoes-mobile">
          <button
            className={`btn-filtro ${showFilters ? 'ativo' : ''}`}
            onClick={() => setShowFilters((v) => !v)}
          >
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="modal-backdrop" onClick={() => setShowFilters(false)} />
        )}

        <aside className="filters-sidebar">
          <Filtro
            // cascata
            listaMontadoras={listaMontadoras}
            montadoraSelecionada={montadoraSelecionada}
            handleMontadoraChange={handleMontadoraChange}
            carregandoCascata={carregandoCascata}
            listaFamilias={listaFamilias}
            familiaSelecionada={familiaSelecionada}
            handleFamiliaChange={handleFamiliaChange}
            listaSubFamilias={listaSubFamilias}
            subFamiliaSelecionada={subFamiliaSelecionada}
            handleSubFamiliaChange={handleSubFamiliaChange}
            carregandoSubFamilias={carregandoSubFamilias}
            // ordenação (novo)
            ordenarPor={ordenarPor}
            ordem={ordem}
            onChangeOrdenarPor={onChangeOrdenarPor}
            onChangeOrdem={onChangeOrdem}
            // ui
            className={showFilters ? 'visivel' : ''}
            onClose={() => setShowFilters(false)}
          />
        </aside>

        <section className="search-results">
          <CardsProdutos
            resultados={resultados}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            handleLinhaClick={handleLinhaClick}
            carregandoTabela={carregandoTabela}
            feedbackMessage={feedbackMessage}
            buscarTratados={handlePageChange}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Resultados;
