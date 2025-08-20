import React, { useState, useEffect, useRef } from 'react';
import Campos from './Campos.jsx';
import Tabela from './Tabela.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Home() {
  const [query, setQuery] = useState('');
  const [placa, setPlaca] = useState('DME8I14');
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [ordem, setOrdem] = useState('asc');
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  const [resultados, setResultados] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [temMaisPaginas, setTemMaisPaginas] = useState(false);
  const [mensagemBusca, setMensagemBusca] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('info');
  const [carregandoTabela, setCarregandoTabela] = useState(false);
  
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Função única para buscar dados
  const buscarProdutos = (pagina = 1) => {
    if (!query) return;

    setCarregandoTabela(true);
    setMensagemBusca('');

    const params = new URLSearchParams({
      produto: query,
      placa: placa,
      marca: marcaSelecionada,
      ordem: ordem,
      pagina: pagina,
    });

    axios.get(`${API_URL}/pesquisar?${params.toString()}`)
      .then(res => {
        const data = res.data;
        setResultados(data.dados || []);
        setMarcas(data.marcas || []);
        setPaginaAtual(data.pagina || 1);
        setTotalPaginas(data.total_paginas || 1);
        setTemMaisPaginas(data.proxima_pagina || false);
        
        if (data.mensagem_busca) {
          setMensagemBusca(data.mensagem_busca);
          setTipoMensagem(data.tipo_mensagem || 'info');
        }
      })
      .catch(() => {
        setResultados([]);
        setMarcas([]);
      })
      .finally(() => setCarregandoTabela(false));
  };

  // Efeito principal que dispara a busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        buscarProdutos(1);
      } else {
        setResultados([]);
        setMarcas([]);
        setMensagemBusca('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, placa, marcaSelecionada, ordem]);

  // Efeito para buscar outras páginas
  const buscarPagina = (novaPagina) => {
    if(query) {
      buscarProdutos(novaPagina);
    }
  }

  // --- LÓGICA DO CLIQUE FORA RESTAURADA ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarSugestoes(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lógica do Autocomplete
  useEffect(() => {
    if (!query) {
      setSugestoes([]);
      setMostrarSugestoes(false);
      return;
    };

    setCarregandoSugestoes(true);
    setMostrarSugestoes(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
        axios.get(`${API_URL}/autocomplete?prefix=${query}`)
          .then(res => setSugestoes(res.data?.sugestoes || []))
          .catch(() => setSugestoes([]))
          .finally(() => setCarregandoSugestoes(false));
    }, 300);
  }, [query]);
  
  const handleLinhaClick = (produto) => {
    if (produto && produto.codigoReferencia) {
        const params = new URLSearchParams({
            id: produto.id,
            codigoReferencia: produto.codigoReferencia,
            nomeProduto: produto.nome, // <-- Verifique se esta linha está exatamente assim
        });
        // A rota deve ser "/produto" para corresponder ao App.jsx
        navigate(`/produto?${params.toString()}`, { state: { produto } });
    } else {
        console.error('Produto inválido:', produto);
        alert('Não foi possível acessar o produto selecionado.');
    }
  };

  const toggleSugestoes = () => setMostrarSugestoes(!mostrarSugestoes);

  return (
    <div className="container-fluid ">
      <div className="row">
        <Campos
          query={query} setQuery={setQuery}
          placa={placa} setPlaca={setPlaca}
          marcas={marcas}
          marcaSelecionada={marcaSelecionada} setMarcaSelecionada={setMarcaSelecionada}
          ordem={ordem} setOrdem={setOrdem}
          sugestoes={sugestoes}
          // --- PROPS RESTAURADAS ---
          dropdownRef={dropdownRef}
          toggleSugestoes={toggleSugestoes}
          mostrarSugestoes={mostrarSugestoes}
          carregandoSugestoes={carregandoSugestoes}
          setMostrarSugestoes={setMostrarSugestoes}
          buscarTratados={() => buscarProdutos(1)}
        />
      </div>
      
      {mensagemBusca && (
        <div className={`alert alert-${tipoMensagem}`} style={{ maxWidth: '90vw', margin: '0 auto 1rem auto', textAlign: 'center' }}>
          {mensagemBusca}
        </div>
      )}

      <Tabela
        resultados={resultados}
        paginaAtual={paginaAtual}
        buscarTratados={buscarPagina}
        totalPaginas={totalPaginas}
        temMaisPaginas={temMaisPaginas}
        handleLinhaClick={handleLinhaClick}
        carregandoTabela={carregandoTabela}
      />
    </div>
  );
}

export default Home;