// src/Paginas/Resultados.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../Componentes/Header.jsx';
import Categorias from '../Componentes/Categorias.jsx';
import Filtro from '../Componentes/Filtro.jsx';
import Ordenar from '../Componentes/Ordenar.jsx';
import CardsProdutos from '../Componentes/CardsProdutos.jsx';
import Footer from '../Componentes/Footer.jsx';

import '/public/style/resultados.scss';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

// UI -> params da API
const mapOrdenacaoToParams = (uiValue) => {
  switch (uiValue) {
    case 'relevancia':        return { ordenar_por: 'score',             ordem: 'desc' };
    case 'menor-preco':       return { ordenar_por: 'menor_preco',       ordem: 'asc'  };
    case 'maior-preco':       return { ordenar_por: 'maior_preco',       ordem: 'desc' };
    case 'melhor-avaliacao':  return { ordenar_por: 'mais_bem_avaliados',ordem: 'desc' };
    default:                  return { ordenar_por: 'score',             ordem: 'desc' };
  }
};

// params -> UI
const mapParamsToOrdenacao = (ordenar_por, ordem) => {
  if (ordenar_por === 'menor_preco')        return 'menor-preco';
  if (ordenar_por === 'maior_preco')        return 'maior-preco';
  if (ordenar_por === 'mais_bem_avaliados') return 'melhor-avaliacao';
  return 'relevancia';
};

function Resultados() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // barra de pesquisa (controlada pela URL)
  const [query, setQuery]   = useState(searchParams.get('termo') || '');
  const [placa, setPlaca]   = useState(searchParams.get('placa') || '');

  // filtros em cascata (não essenciais, mas mantidos)
  const [listaMontadoras, setListaMontadoras] = useState([]);
  const [listaFamilias,   setListaFamilias]   = useState([]);
  const [listaSubFamilias,setListaSubFamilias]= useState([]);

  const [montadoraSelecionada, setMontadoraSelecionada] = useState({
    id:   searchParams.get('marca_id') || '',
    nome: searchParams.get('marca')    || ''
  });
  const [familiaSelecionada, setFamiliaSelecionada] = useState({
    id:   searchParams.get('familia_id')  || '',
    nome: searchParams.get('familia_nome')|| ''
  });
  const [subFamiliaSelecionada, setSubFamiliaSelecionada] = useState({
    id:   searchParams.get('subfamilia_id')  || '',
    nome: searchParams.get('subfamilia_nome')|| ''
  });

  const [carregandoCascata, setCarregandoCascata]       = useState(false);
  const [carregandoSubFamilias, setCarregandoSubFamilias]= useState(false);

  // resultados
  const [resultados, setResultados]     = useState([]);
  const [paginaAtual, setPaginaAtual]   = useState(parseInt(searchParams.get('pagina') || '1', 10));
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregandoTabela, setCarregandoTabela] = useState(false);
  const [feedbackMessage, setFeedbackMessage]   = useState('');

  const dropdownRef = useRef(null);

  // UI ordenação
  const ordenar_por_ini = searchParams.get('ordenar_por') || 'score';
  const ordem_ini       = searchParams.get('ordem')       || 'desc';
  const [ordenacao, setOrdenacao] = useState(mapParamsToOrdenacao(ordenar_por_ini, ordem_ini));

  // modais mobile
  const [showFilters, setShowFilters] = useState(false);
  const [showSort,    setShowSort]    = useState(false);

  // ---------- carregar dados da cascata ----------
  useEffect(() => {
    let mounted = true;
    async function carregar() {
      setCarregandoCascata(true);
      try {
        const [mont, fam] = await Promise.all([
          axios.get(`${API_URL}/montadoras`),
          axios.get(`${API_URL}/familias`),
        ]);
        if (!mounted) return;
        setListaMontadoras(mont.data || []);
        setListaFamilias(fam.data || []);
      } catch (e) {
        console.error('Erro ao carregar cascata', e);
      } finally {
        mounted && setCarregandoCascata(false);
      }
    }
    carregar();
    return () => { mounted = false; };
  }, []);

  // ---------- subfamílias quando muda a família ----------
  useEffect(() => {
    if (!familiaSelecionada.id) {
      setListaSubFamilias([]);
      return;
    }
    setCarregandoSubFamilias(true);
    axios.get(`${API_URL}/familias/${familiaSelecionada.id}/subfamilias`)
      .then(res => setListaSubFamilias(res.data || []))
      .catch(err => console.error('Erro ao buscar subfamílias', err))
      .finally(() => setCarregandoSubFamilias(false));
  }, [familiaSelecionada.id]);

  // ---------- busca principal (reage à URL) ----------
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    // dispara se: termo OU (marca + familia_id)
    if (params.termo || (params.marca && params.familia_id)) {
      setCarregandoTabela(true);
      axios.get(`${API_URL}/pesquisar`, { params })
        .then(res => {
          setResultados(res.data?.dados || []);
          setPaginaAtual(res.data?.pagina || 1);
          setTotalPaginas(res.data?.total_paginas || 1);
          setFeedbackMessage(res.data?.mensagem || '');
        })
        .catch(err => console.error('Erro na busca', err))
        .finally(() => setCarregandoTabela(false));
    } else {
      setResultados([]);
      setPaginaAtual(1);
      setTotalPaginas(1);
      setFeedbackMessage('');
    }
  }, [searchParams]);

  // ---------- sincroniza estado local com a URL ----------
  useEffect(() => {
    const termoURL  = searchParams.get('termo') || '';
    const placaURL  = searchParams.get('placa') || '';
    const ordPorURL = searchParams.get('ordenar_por') || 'score';
    const ordemURL  = searchParams.get('ordem') || 'desc';
    const pageURL   = parseInt(searchParams.get('pagina') || '1', 10);

    if (termoURL !== query) setQuery(termoURL);
    if (placaURL !== placa) setPlaca(placaURL);

    const ordUI = mapParamsToOrdenacao(ordPorURL, ordemURL);
    if (ordUI !== ordenacao) setOrdenacao(ordUI);

    if (pageURL !== paginaAtual) setPaginaAtual(pageURL);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- handlers ----------
  const handleLinhaClick = (produto) => {
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  // paginação (sem mutar o mesmo objeto!)
  const handlePageChange = (pagina) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('pagina', String(pagina));
      return p;
    });
  };

  // submit da barra (termo/placa)
  const handleSearchSubmit = (termo, placaVal) => {
    const { ordenar_por, ordem } = mapOrdenacaoToParams(ordenacao);
    const next = {
      pagina: '1',
      ordenar_por,
      ordem,
    };
    if (termo)    next.termo = termo;
    if (placaVal) next.placa = placaVal;

    // ao pesquisar por termo, limpamos filtros de cascata da URL
    setMontadoraSelecionada({ id: '', nome: '' });
    setFamiliaSelecionada({ id: '', nome: '' });
    setSubFamiliaSelecionada({ id: '', nome: '' });

    setSearchParams(next);
  };

  // cascata
  const handleMontadoraChange = (id, nome) => {
    setMontadoraSelecionada({ id, nome });
    setFamiliaSelecionada({ id: '', nome: '' });
    setSubFamiliaSelecionada({ id: '', nome: '' });
  };

  const handleFamiliaChange = (id, nome) => {
    setFamiliaSelecionada({ id, nome });
    setSubFamiliaSelecionada({ id: '', nome: '' });

    if (montadoraSelecionada.nome && id) {
      const { ordenar_por, ordem } = mapOrdenacaoToParams(ordenacao);
      setSearchParams({
        marca: montadoraSelecionada.nome,
        familia_id: id,
        familia_nome: nome,
        pagina: '1',
        ordenar_por,
        ordem,
      });
    }
  };

  const handleSubFamiliaChange = (id, nome) => {
    setSubFamiliaSelecionada({ id, nome });
    if (montadoraSelecionada.nome && familiaSelecionada.id) {
      const { ordenar_por, ordem } = mapOrdenacaoToParams(ordenacao);
      setSearchParams({
        marca: montadoraSelecionada.nome,
        familia_id: familiaSelecionada.id,
        familia_nome: familiaSelecionada.nome,
        pagina: '1',
        ordenar_por,
        ordem,
        ...(id ? { subfamilia_id: id, subfamilia_nome: nome } : {}),
      });
    }
  };

  // ordenação (UI -> URL)
  const handleMudarOrdenacao = (nova) => {
    setOrdenacao(nova);
    const { ordenar_por, ordem } = mapOrdenacaoToParams(nova);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('ordenar_por', ordenar_por);
      p.set('ordem', ordem);
      p.set('pagina', '1');
      return p;
    });
  };

  // clique nas categorias do topo
  const handleCategoryClick = (categoryName) => {
    const { ordenar_por, ordem } = mapOrdenacaoToParams(ordenacao);
    const next = new URLSearchParams({
      termo: categoryName,
      pagina: '1',
      ordenar_por,
      ordem,
    });
    navigate(`/resultados?${next.toString()}`);
  };

  return (
    <div className="container">
      <Header
        query={query} setQuery={setQuery}
        placa={placa} setPlaca={setPlaca}
        dropdownRef={dropdownRef}
        onSearchSubmit={handleSearchSubmit}
      />

      <Categorias onCategoryClick={handleCategoryClick} />

      <main className="search-page-container">
        <div className="opcoes-mobile">
          <button
            className={`btn-filtro ${showFilters ? 'ativo' : ''}`}
            onClick={() => { setShowFilters(v => !v); if (showSort) setShowSort(false); }}
          >
            Filtros
          </button>

          <button
            className={`btn-ordenar ${showSort ? 'ativo' : ''}`}
            onClick={() => { setShowSort(v => !v); if (showFilters) setShowFilters(false); }}
          >
            Ordenar
          </button>
        </div>

        {showSort    && <div className="modal-backdrop" onClick={() => setShowSort(false)} />}
        {showFilters && <div className="modal-backdrop" onClick={() => setShowFilters(false)} />}

        <aside className="filters-sidebar">
          <Filtro
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
            className={showFilters ? 'visivel' : ''}
            onClose={() => setShowFilters(false)}
          />
        </aside>

        <div className="ordenar-wrapper">
          <Ordenar
            ordenacaoAtual={ordenacao}
            onMudarOrdenacao={handleMudarOrdenacao}
            onClose={() => setShowSort(false)}
            visivel={showSort ? 'visivel' : ''}
          />
        </div>

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
