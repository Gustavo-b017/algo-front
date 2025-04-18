import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ResultsTable from './components/ResultsTable';
import Pagination from './components/Pagination';
import HeapResults from './components/HeapResults';
import './App.css';
import Url from 'https://algo-back-production.up.railway.app'

function App() {
  // Estados
  const BASE_URL = 'https://algo-back-production.up.railway.app';
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itensPorPagina = 15;
  const [order, setOrder] = useState('asc');
  const [loadingHeap, setLoadingHeap] = useState(false);
  const [heapResults, setHeapResults] = useState([]);

  // Função para atualizar a busca
  const atualizarBusca = (termo) => {
    setSearchTerm(termo);
    setCurrentPage(1); // Reinicia para a primeira página ao atualizar a busca
  };

  // Debounce para a busca de sugestões (200ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        buscarProdutos();
      }
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, buscarProdutos]);
  

  // Função para buscar produtos e marcas
  const buscarProdutos = useCallback(() => {
    if (!searchTerm) {
      setResults([]);
      setBrands([]);
      setSelectedBrand('');
      return;
    }
    setLoading(true);
    const url = `${BASE_URL}/buscar?produto=${encodeURIComponent(searchTerm)}&ordem=${order}&pagina=${currentPage}&itensPorPagina=${itensPorPagina}`;

    console.log("Buscando produtos para:", searchTerm);
    fetch(url)
      .then(resp => {
         if (!resp.ok) {
           return resp.text().then(text => { throw new Error(text || `Erro ao buscar produtos (status ${resp.status})`); });
         }
         return resp.text();
      })
      .then(text => {
         if (!text) {
           setResults([]);
           setBrands([]);
           setLoading(false);
           return;
         }
         try {
           const data = JSON.parse(text);
           setResults(Array.isArray(data.results) ? data.results : []);
           setBrands(Array.isArray(data.brands) ? data.brands : []);
         } catch (error) {
           console.error("Erro ao parsear JSON da busca:", error);
           setResults([]);
           setBrands([]);
         }
         setLoading(false);
      })
      .catch(err => {
         console.error("Erro ao buscar produtos:", err);
         setResults([]);
         setBrands([]);
         setLoading(false);
      });
  }, [searchTerm, order, currentPage, itensPorPagina]);

  // Atualiza os resultados filtrados quando a marca é selecionada
  useEffect(() => {
    if (selectedBrand) {
      const filtered = results.filter(item => {
         const marca = item.data ? item.data.marca : item.marca;
         return marca === selectedBrand;
      });
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  }, [results, selectedBrand]);

  // Função para lidar com a seleção da marca
  const handleBrandSelect = (e) => {
    setSelectedBrand(e.target.value);
  };

  // Função para atualizar a ordem
  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    setCurrentPage(1);
  };

  // Função para buscar k elementos via heap (testeHeap)
  const testeHeap = () => {
    setLoadingHeap(true);
    const url = `${BASE_URL}/heap?produto=${encodeURIComponent(searchTerm)}&k=3&largest=true&key=hp`;

    fetch(url)
      .then(resp => {
         if (!resp.ok) {
           return resp.text().then(text => { throw new Error(text || `Erro no endpoint heap (status ${resp.status})`); });
         }
         return resp.text();
      })
      .then(text => {
         if (!text) {
           setHeapResults([]);
           setLoadingHeap(false);
           return;
         }
         try {
           const data = JSON.parse(text);
           setHeapResults(Array.isArray(data) ? data : []);
         } catch (error) {
           console.error("Erro ao parsear JSON do heap:", error);
           setHeapResults([]);
         }
         setLoadingHeap(false);
      })
      .catch(err => {
         console.error("Erro no endpoint heap:", err);
         setHeapResults([]);
         setLoadingHeap(false);
      });
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="container p-4">
      <Navbar atualizarBusca={atualizarBusca} />
      <h2>Buscar Produtos</h2>
      <div className="d-flex mb-3">
         <input 
           type="text" 
           className="form-control me-2" 
           placeholder="Digite o nome do produto..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
         <select className="form-select" value={selectedBrand} onChange={handleBrandSelect}>
           <option value="">Selecione a Marca</option>
           {brands.map((brand, idx) => (
              <option key={idx} value={brand}>{brand}</option>
           ))}
         </select>
      </div>
      <div className="mb-3">
         <label htmlFor="ordem" className="form-label">Ordem:</label>
         <select
           id="ordem"
           className="form-select"
           value={order}
           onChange={handleOrderChange}
         >
           <option value="asc">Crescente</option>
           <option value="desc">Decrescente</option>
         </select>
      </div>
      {searchTerm && selectedBrand && (
         <>
            {loading ? (
               <div className="text-center mt-2">
                  <div className="spinner-border text-primary" role="status">
                     <span className="visually-hidden">Carregando...</span>
                  </div>
               </div>
            ) : (
               <>
                  <ResultsTable results={filteredResults} loading={loading} />
                  <Pagination 
                    currentPage={currentPage} 
                    prevPage={prevPage} 
                    nextPage={nextPage}
                    totalResults={filteredResults.length}
                  />
               </>
            )}
         </>
      )}
      <HeapResults heapResults={heapResults} loadingHeap={loadingHeap} onTesteHeap={testeHeap} />
    </div>
  );
}

export default App;