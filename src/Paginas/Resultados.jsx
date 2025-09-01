// src/Paginas/Resultados.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Componentes/Header.jsx';
import CardsProdutos from '../Componentes/CardsProdutos.jsx';
import Footer from '../Componentes/Footer.jsx';
import FiltroLateral from '../Componentes/FiltroLateral.jsx';
import '/public/style/Resultados.css';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:5000';

function Resultados() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ... (o resto dos seus 'useState' permanece o mesmo)
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

  // A função de busca permanece a mesma
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

  // O useEffect para buscar os dados com base na URL permanece o mesmo
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

  const handleLinhaClick = (produto) => {
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  const handlePageChange = (pagina) => {
      setSearchParams(prev => {
          prev.set('pagina', pagina);
          return prev;
      });
  };

  const handleFilterChange = (filters) => {
    setSearchParams(prev => {
        if (filters.montadora) prev.set('marca', filters.montadora);
        else prev.delete('marca');
        
        if (filters.familia) prev.set('familia_id', filters.familia);
        else prev.delete('familia_id');

        prev.set('pagina', '1');
        return prev;
    }, { replace: true });
  };

  return (
    <div className="container-fluid">
      <Header
        query={query} setQuery={setQuery}
        placa={placa} setPlaca={setPlaca}
        sugestoes={sugestoes}
        mostrarSugestoes={mostrarSugestoes} setMostrarSugestoes={setMostrarSugestoes}
        carregandoSugestoes={carregandoSugestoes}
        dropdownRef={dropdownRef}
        // ADICIONADO A LINHA ABAIXO PARA CORRIGIR O ERRO
        onSearchSubmit={(termo, placa) => setSearchParams({ termo, placa })}
      />
      <div className="resultados-container">
        <FiltroLateral onFilterChange={handleFilterChange} />
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
      </div>
      <Footer />
    </div>
  );
}

export default Resultados;