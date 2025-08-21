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
    // Limpa a mensagem apenas se for uma nova busca (página 1)
    if (pagina === 1) {
        setMensagemBusca('');
    }

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

  // Função para buscar outras páginas, atualizando o estado da página
  const buscarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  }

  // Efeito que reage à mudança da página para buscar os dados
  useEffect(() => {
    if (query && paginaAtual > 0) {
        buscarProdutos(paginaAtual);
    }
  }, [paginaAtual]);


  // Lógica do clique fora
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
        // --- PARÂMETRO DA PLACA ADICIONADO AQUI ---
        axios.get(`${API_URL}/autocomplete?prefix=${query}&placa=${placa}`)
          .then(res => setSugestoes(res.data?.sugestoes || []))
          .catch(() => setSugestoes([]))
          .finally(() => setCarregandoSugestoes(false));
    }, 300);
  }, [query, placa]); // Depende da query e da placa
  
  const handleLinhaClick = (produto) => {
    if (produto && produto.codigoReferencia) {
        const params = new URLSearchParams({
            id: produto.id,
            codigoReferencia: produto.codigoReferencia,
            nomeProduto: produto.nome,
        });
        navigate(`/produto?${params.toString()}`, { state: { produto } });
    } else {
        console.error('Produto inválido:', produto);
        alert('Não foi possível acessar o produto selecionado.');
    }
  };

  const toggleSugestoes = () => setMostrarSugestoes(!mostrarSugestoes);
  
  const handleSelectSugestao = (sugestao) => {
    setQuery(sugestao);
    setMostrarSugestoes(false);
  };

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
          dropdownRef={dropdownRef}
          toggleSugestoes={toggleSugestoes}
          mostrarSugestoes={mostrarSugestoes}
          carregandoSugestoes={carregandoSugestoes}
          // Passa a função correta para o Campos poder usar ao selecionar uma sugestão
          handleSelectSugestao={handleSelectSugestao}
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
        buscarTratados={buscarPagina} // buscarPagina agora é a função correta
        totalPaginas={totalPaginas}
        temMaisPaginas={temMaisPaginas}
        handleLinhaClick={handleLinhaClick}
        carregandoTabela={carregandoTabela}
      />
    </div>
  );
}

export default Home;