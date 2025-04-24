
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
  const [, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  const wrapperRef = useRef(null);
  const itensPorPagina = 10;

  const fetchResults = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/buscar?produto=${searchTerm}&marca=${selectedBrand}&ordem=${order}&pagina=${currentPage - 1}&itensPorPagina=${itensPorPagina}`
      );
      const data = await res.json();
      setResults(data.results || []);
      setAvailableBrands(data.brands || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [searchTerm, selectedBrand, order, currentPage]);

  const fetchSuggestions = async (prefix) => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch('/autocomplete?prefix=' + prefix);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingSuggestions(false);
  };

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      fetchResults();
    }
  }, [fetchResults, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      fetchSuggestions(searchTerm);
    }
  }, [searchTerm]);

  const highlightMatch = (text, term) => {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  return (
    <div className="container py-4">
      <div className="row align-items-end g-3">
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
          marcaSelecionada={selectedBrand}
          setMarcaSelecionada={setSelectedBrand}
        />
        <OrderSelector order={order} setOrder={setOrder} />
      </div>

      <Paginator
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={results.length}
        porPagina={itensPorPagina}
      />

      <ResultsTable resultados={results.slice((currentPage - 1) * itensPorPagina, currentPage * itensPorPagina)} />

      <Suspense fallback={<div>Carregando heap...</div>}>
        {showSuggestions && <HeapResults />}
      </Suspense>
    </div>
  );
}

export default App;
