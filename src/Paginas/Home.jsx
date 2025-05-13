import React, { useState, useEffect, useRef } from 'react';
import Campos from './Campos.jsx'; // <-- agora o autocomplete estará dentro do Campos.jsx
import Tabela from './Tabela.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://127.0.0.1:5000';

function Home() {
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
  const [carregandoTabela, setCarregandoTabela] = useState(false);

  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const ultimaQueryAutocomplete = useRef('');
  const navigate = useNavigate();

  const buscarTratados = (pagina = 1) => {
    setCarregandoTabela(true);
    axios.get(`${API_URL}/tratados?produto=${query}&marca=${marcaSelecionada}&ordem=${ordem}&pagina=${pagina}`)
      .then(res => {
        const data = res.data;
        setResultados(Array.isArray(data.dados) ? data.dados : []);
        setPaginaAtual(data.pagina || 1);
        setTotalPaginas(data.total_paginas || 1);
        setTemMaisPaginas(data.proxima_pagina || false);
        setMarcas(Array.isArray(data.marcas) ? data.marcas : []);
      })
      .catch(() => setResultados([]))
      .finally(() => setCarregandoTabela(false));
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
      axios.get(`${API_URL}/buscar?produto=${query}`)
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
        axios.get(`${API_URL}/buscar?produto=${query}`).then(() => {
          ultimaQueryAutocomplete.current = query;
          axios.get(`${API_URL}/autocomplete?prefix=${query}`)
            .then(res => {
              const data = res.data?.sugestoes;
              setSugestoes(Array.isArray(data) ? data : []);
            })
            .catch(() => setSugestoes([]))
            .finally(() => setCarregandoSugestoes(false));
        });
      } else {
        axios.get(`${API_URL}/autocomplete?prefix=${query}`)
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
      axios.get(`${API_URL}/autocomplete?prefix=${query}`)
        .then(res => {
          const data = res.data?.sugestoes;
          setSugestoes(Array.isArray(data) ? data : []);
        })
        .catch(() => setSugestoes([]))
        .finally(() => setCarregandoSugestoes(false));
    }
  };

  const handleLinhaClick = (produto) => {
    if (produto && produto.codigoReferencia) {
      const query = `codigoReferencia=${encodeURIComponent(produto.codigoReferencia)}&id=${produto.id}&nomeProduto=${encodeURIComponent(produto.nome)}`;
      navigate(`/produto/${query}`, { state: { produto } });

    } else {
      console.error('Produto inválido ao tentar navegar:', produto);
      alert('Não foi possível acessar o produto selecionado.');
    }
  };


  return (
    <div className="home container-fluid">
      <div className="row">
        <Campos
          query={query}
          setQuery={setQuery}
          marcas={marcas}
          marcaSelecionada={marcaSelecionada}
          setMarcaSelecionada={setMarcaSelecionada}
          ordem={ordem}
          setOrdem={setOrdem}
          dropdownRef={dropdownRef}
          toggleSugestoes={toggleSugestoes}
          sugestoes={sugestoes}
          mostrarSugestoes={mostrarSugestoes}
          carregandoSugestoes={carregandoSugestoes}
          setMostrarSugestoes={setMostrarSugestoes}
          buscarTratados={buscarTratados}
        />
      </div>
      <Tabela
        resultados={resultados}
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        temMaisPaginas={temMaisPaginas}
        buscarTratados={buscarTratados}
        handleLinhaClick={handleLinhaClick}
        carregandoTabela={carregandoTabela}
      />
    </div>
  );
}

export default Home;
