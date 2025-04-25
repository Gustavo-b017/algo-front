import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [query, setQuery] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [ordem, setOrdem] = useState('asc');
  const [resultados, setResultados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [temMaisPaginas, setTemMaisPaginas] = useState(false);

  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const ultimaQueryAutocomplete = useRef('');

  const buscarTratados = (pagina = 1) => {
    axios.get(`/tratados?produto=${query}&marca=${marcaSelecionada}&ordem=${ordem}&pagina=${pagina}`)
      .then(res => {
        const data = res.data;
        setResultados(Array.isArray(data.dados) ? data.dados : []);
        setPaginaAtual(data.pagina || 1);
        setTotalPaginas(data.total_paginas || 1);
        setTemMaisPaginas(data.proxima_pagina || false);
        setMarcas(Array.isArray(data.marcas) ? data.marcas : []);
      })
      .catch(() => setResultados([]));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarSugestoes(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query) {
      axios.get(`/buscar?produto=${query}`)
        .then(() => buscarTratados(1))
        .catch(() => setResultados([]));
    } else {
      setResultados([]);
    }
  }, [query]);

  useEffect(() => {
    if (query) buscarTratados(paginaAtual);
  }, [marcaSelecionada, ordem]);

  useEffect(() => {
    if (!query) return;
    setCarregandoSugestoes(true);
    setMostrarSugestoes(true);
    setSugestoes([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query !== ultimaQueryAutocomplete.current) {
        axios.get(`/buscar?produto=${query}`).then(() => {
          ultimaQueryAutocomplete.current = query;
          axios.get(`/autocomplete?prefix=${query}`)
            .then(res => {
              const data = res.data?.sugestoes;
              setSugestoes(Array.isArray(data) ? data : []);
            })
            .catch(() => setSugestoes([]))
            .finally(() => setCarregandoSugestoes(false));
        });
      } else {
        axios.get(`/autocomplete?prefix=${query}`)
          .then(res => {
            const data = res.data?.sugestoes;
            setSugestoes(Array.isArray(data) ? data : []);
          })
          .catch(() => setSugestoes([]))
          .finally(() => setCarregandoSugestoes(false));
      }
    }, 300);
  }, [query]);

  const toggleSugestoes = () => {
    if (mostrarSugestoes) {
      setMostrarSugestoes(false);
    } else {
      setCarregandoSugestoes(true);
      setMostrarSugestoes(true);
      axios.get(`/autocomplete?prefix=${query}`)
        .then(res => {
          const data = res.data?.sugestoes;
          setSugestoes(Array.isArray(data) ? data : []);
        })
        .catch(() => setSugestoes([]))
        .finally(() => setCarregandoSugestoes(false));
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-3 align-items-start">
        <div className="col-md-4 position-relative" ref={dropdownRef}>
          <div className="position-relative">
            <input
              type="text"
              className="form-control pe-5"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setMostrarSugestoes(true)}
            />
            <button
              className="btn btn-sm position-absolute end-0 top-0 mt-1 me-2 bg-transparent border-0"
              title="Alternar sugestões"
              onClick={toggleSugestoes}
            >
              &#9776;
            </button>
          </div>
          {mostrarSugestoes && (
            <ul className="list-group position-absolute w-100 z-3 mt-1">
              {carregandoSugestoes ? (
                <li className="list-group-item text-center">Carregando...</li>
              ) : (
                sugestoes.map((s, i) => (
                  <li
                    key={i}
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      setQuery(s);
                      setMostrarSugestoes(false);
                    }}
                  >
                    {s}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={marcaSelecionada}
            onChange={(e) => setMarcaSelecionada(e.target.value)}
          >
            <option value="">Todas as Marcas</option>
            {marcas.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Nome</th>
              <th>Marca</th>
              <th>Potência</th>
              <th>Ano Início</th>
              <th>Ano Fim</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((item, i) => (
              <tr key={i}>
                <td>{item.nome}</td>
                <td>{item.marca}</td>
                <td>{item.potencia}</td>
                <td>{item.ano_inicio}</td>
                <td>{item.ano_fim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={paginaAtual === 1}
          onClick={() => buscarTratados(paginaAtual - 1)}
        >
          Página Anterior
        </button>
        <button
          className="btn btn-secondary"
          disabled={!temMaisPaginas}
          onClick={() => buscarTratados(paginaAtual + 1)}
        >
          Próxima Página
        </button>
      </div>
    </div>
  );
}

export default App;
