// src/Paginas/Resultados.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Componentes/Header.jsx';
import CardsProdutos from '../Componentes/CardsProdutos.jsx';
import Footer from '../Componentes/Footer.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function Resultados() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estados da Busca por Texto
  const [query, setQuery] = useState('');
  const [placa, setPlaca] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [ordem, setOrdem] = useState('asc');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
  
  const [resultados, setResultados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregandoTabela, setCarregandoTabela] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const dropdownRef = useRef(null);

  // Função de busca principal
  const buscarResultados = (config) => {
    setCarregandoTabela(true);
    setFeedbackMessage('');

    let params = new URLSearchParams({
      pagina: config.pagina,
      termo: config.termo,
      placa: config.placa,
      marca: config.marca,
      ordem: config.ordem,
    });

    axios.get(`${API_URL}/pesquisar?${params.toString()}`)
      .then(res => {
        setResultados(res.data.dados || []);
        setMarcas(res.data.marcas || []);
        setPaginaAtual(res.data.pagina || 1);
        setTotalPaginas(res.data.total_paginas || 1);
        setFeedbackMessage(res.data.mensagem || '');
      })
      .catch(err => console.error("Erro na busca", err))
      .finally(() => setCarregandoTabela(false));
  };

  // Sincroniza a busca com os parâmetros da URL
  useEffect(() => {
    const termoDaUrl = searchParams.get('termo') || '';
    const placaDaUrl = searchParams.get('placa') || '';
    const marcaDaUrl = searchParams.get('marca') || '';
    const ordemDaUrl = searchParams.get('ordem') || 'asc';

    setQuery(termoDaUrl);
    setPlaca(placaDaUrl);
    setMarcaSelecionada(marcaDaUrl);
    setOrdem(ordemDaUrl);
    
    buscarResultados({
      pagina: 1,
      termo: termoDaUrl,
      placa: placaDaUrl,
      marca: marcaDaUrl,
      ordem: ordemDaUrl,
    });
  }, [searchParams]);

  // Efeito para a busca de sugestões
  useEffect(() => {
    if (!query) {
      setSugestoes([]);
      setMostrarSugestoes(false);
      return;
    }
    const timer = setTimeout(() => {
      setCarregandoSugestoes(true);
      axios.get(`${API_URL}/autocomplete?prefix=${query}`)
        .then(res => setSugestoes(res.data?.sugestoes || []))
        .catch(() => setSugestoes([]))
        .finally(() => setCarregandoSugestoes(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Handler para o clique no card de produto
  const handleLinhaClick = (produto) => {
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  // Handler para atualizar a página de resultados
  const handlePageChange = (pagina) => {
      setSearchParams(prev => {
          prev.set('pagina', pagina);
          return prev;
      });
      buscarResultados({
          pagina: pagina,
          termo: query,
          placa: placa,
          marca: marcaSelecionada,
          ordem: ordem
      });
  };

  return (
    <div className="container-fluid">
      <Header
        query={query} setQuery={setQuery}
        placa={placa} setPlaca={setPlaca}
        marcas={marcas}
        marcaSelecionada={marcaSelecionada} setMarcaSelecionada={setMarcaSelecionada}
        ordem={ordem} setOrdem={setOrdem}
        sugestoes={sugestoes}
        mostrarSugestoes={mostrarSugestoes} setMostrarSugestoes={setMostrarSugestoes}
        carregandoSugestoes={carregandoSugestoes}
        dropdownRef={dropdownRef}
      />
      <div className="main-content">
        <CardsProdutos
          resultados={resultados}
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          handleLinhaClick={handleLinhaClick}
          carregandoTabela={carregandoTabela}
          feedbackMessage={feedbackMessage}
          buscarTratados={handlePageChange}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Resultados;