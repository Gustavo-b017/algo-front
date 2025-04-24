import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import './App.css';

import SearchInput from './components/SearchInput';
import MarcaSelector from './components/MarcaSelector';
import OrderSelector from './components/OrderSelector';
import Paginator from './components/Paginator';
import ResultsTable from './components/ResultsTable';

const HeapResults = lazy(() => import('./components/HeapResults'));

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [showHeap, setShowHeap] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const resultadosPorPagina = 15;
  const wrapperRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedFetchRef = useRef(
    debounce((term) => {
      setLoadingSuggestions(true);
      setSuggestions(['Pesquisando...']);
      const url = `${BASE_URL}/autocomplete?prefix=${encodeURIComponent(term)}`;
      fetch(url)
        .then(resp => resp.ok ? resp.json() : Promise.reject(resp.statusText))
        .then(data => {
          setSuggestions(Array.isArray(data) ? data : []);
          setLoadingSuggestions(false);
        })
        .catch(() => {
          setSuggestions([]);
          setLoadingSuggestions(false);
        });
    }, 200)
  );

  const buscarMarcasAutomaticamente = useCallback(async (termo) => {
    try {
      const url = `${BASE_URL}/buscar?produto=${encodeURIComponent(termo)}&pagina=1&itensPorPagina=200`;
      const resp = await fetch(url);
      const data = await resp.json();
      console.log("Dados recebidos:", data);
      const produtos = Array.isArray(data) ? data : [];

      const marcas = Array.from(
        new Set(produtos.map(item => item.marca).filter(Boolean))
      );

      setAvailableBrands(marcas);
      if (!marcas.includes(marcaSelecionada)) {
        setMarcaSelecionada(marcas[0] || '');
      }
    } catch (err) {
      console.error("Erro ao buscar marcas automaticamente", err);
      setAvailableBrands([]);
      setMarcaSelecionada('');
    }
  }, [marcaSelecionada, BASE_URL]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      debouncedFetchRef.current(searchTerm);
      buscarMarcasAutomaticamente(searchTerm);
    } else {
      setSuggestions([]);
      setAvailableBrands([]);
      setMarcaSelecionada('');
    }
  }, [searchTerm, buscarMarcasAutomaticamente]);

  const buscarProdutos = useCallback(() => {
    if (searchTerm.trim() === '' || marcaSelecionada.trim() === '') return;

    setLoading(true);
    setMostrarResultados(false);

    const url = `${BASE_URL}/buscar?produto=${encodeURIComponent(searchTerm)}&marca=${encodeURIComponent(marcaSelecionada)}&ordem=${order}`;

    fetch(url)
      .then(resp => resp.ok ? resp.json() : Promise.reject(resp.statusText))
      .then(data => {
        const produtos = Array.isArray(data) ? data : [];
        setResults(produtos);
        console.log("🔎 API debugInfo:", data.debugInfo);
        setMostrarResultados(true);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos", err);
        setResults([]);
        setLoading(false);
      });
  }, [searchTerm, marcaSelecionada, order, BASE_URL]);

  useEffect(() => {
    if (searchTerm && marcaSelecionada) {
      buscarProdutos();
    }
  }, [searchTerm, marcaSelecionada, order, currentPage, buscarProdutos]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    function handleEscKey(event) {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const highlightMatch = (text, prefix) => {
    const idx = text.toLowerCase().indexOf(prefix.toLowerCase());
    if (idx === -1) return text;
    return (
      text.substring(0, idx) + '<strong>' +
      text.substring(idx, idx + prefix.length) + '</strong>' +
      text.substring(idx + prefix.length)
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Buscar Produtos</h2>

      <div className="row g-3 align-items-end">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          suggestions={suggestions}
          loadingSuggestions={loadingSuggestions}
          wrapperRef={wrapperRef}
          highlightMatch={highlightMatch}
        />
        <MarcaSelector
          availableBrands={availableBrands}
          marcaSelecionada={marcaSelecionada}
          setMarcaSelecionada={setMarcaSelecionada}
        />
        <OrderSelector
          order={order}
          setOrder={setOrder}
        />
      </div>

      {loading && <div className="mt-4">Carregando resultados...</div>}

      {mostrarResultados && (
        <>
          <h4 className="mt-4">Resultados por página</h4>
          <div style={{ overflowX: "auto" }}>
            <ResultsTable results={results} loading={loading} />
          </div>
          <Paginator
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            total={results.length}
            porPagina={resultadosPorPagina}
          />

          <div className="mt-4">
            <button className="btn btn-outline-primary" onClick={() => setShowHeap(true)}>
              Carregar análise Heap
            </button>
            {showHeap && (
              <Suspense fallback={<div>Carregando Heap...</div>}>
                <HeapResults produto={searchTerm} marca={marcaSelecionada} />
              </Suspense>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
