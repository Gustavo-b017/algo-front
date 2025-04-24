import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import './App.css';

import SearchInput from './components/SearchInput';
import MarcaSelector from './components/MarcaSelector';
import OrderSelector from './components/OrderSelector';
import Paginator from './components/Paginator';
import ResultsTable from './components/ResultsTable';

const HeapResults = lazy(() => import('./components/HeapResults'));

function AppDebug() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [order, setOrder] = useState('asc');
  
  
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  
  const wrapperRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  

  const buscarProdutos = useCallback(() => {
    if (searchTerm.trim() === '' || marcaSelecionada.trim() === '') return;

    setLoading(true);
    setMostrarResultados(false);

    const url = `${BASE_URL}/buscar?produto=${encodeURIComponent(searchTerm)}&marca=${encodeURIComponent(marcaSelecionada)}&ordem=${order}`;

    fetch(url)
      .then(resp => resp.ok ? resp.json() : Promise.reject(resp.statusText))
      .then(data => {
        const produtos = Array.isArray(data.results) ? data.results : [];
        setResults(produtos);
        setDebugInfo(data.debugInfo);
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
  }, [searchTerm, marcaSelecionada, order, buscarProdutos]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Depuração de Produtos</h2>

      <div className="row g-3 align-items-end">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
                    wrapperRef={wrapperRef}
        />
        <MarcaSelector
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
          <h4 className="mt-4">Resultados</h4>
          <div style={{ overflowX: "auto" }}>
            <ResultsTable results={results} loading={loading} />
          </div>
        </>
      )}
    {debugInfo && (
        <div className="mt-4">
          <h5>Resposta bruta da API (debugInfo)</h5>
          <pre style={{ maxHeight: '300px', overflowY: 'scroll', backgroundColor: '#f8f9fa', padding: '1rem', border: '1px solid #ccc' }}>
            {debugInfo}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AppDebug;
