import React, { useState, useEffect, useRef } from 'react';
import Header from '../Componentes/Header.jsx';
import Banner from '../Componentes/Banner.jsx';
import Categorias from '../Componentes/Categorias.jsx';
import ProdutoDestaque from '../Componentes/ProdutoDestaque.jsx';
import Marcas from '../Componentes/Marcas.jsx';
import Footer from '../Componentes/Footer.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://127.0.0.1:5000';

function Home() {
  // --- Estados ---
  const [listaMontadoras, setListaMontadoras] = useState([]);
  const [listaFamilias, setListaFamilias] = useState([]);
  const [montadoraSelecionada, setMontadoraSelecionada] = useState({ id: '', nome: '' });
  const [familiaSelecionada, setFamiliaSelecionada] = useState({ id: '', nome: '' });
  const [carregandoCascata, setCarregandoCascata] = useState(true);

  // Estados da Busca por Texto
  const [query, setQuery] = useState('');
  const [placa, setPlaca] = useState('DME8I14');
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
  const isClearingRef = useRef(false);
  const navigate = useNavigate();

  // --- Funções ---
  const buscarResultados = (config) => {
    setCarregandoTabela(true);
    let params = new URLSearchParams({ pagina: config.pagina });
    setFeedbackMessage('');

    if (config.tipo === 'guiada') {
      params.append('montadora_nome', config.montadora_nome);
      params.append('familia_id', config.familia_id);
      params.append('familia_nome', config.familia_nome);
    } else {
      params.append('termo', config.termo);
      params.append('placa', config.placa);
      params.append('marca', config.marca);
      params.append('ordem', config.ordem);
    }

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

  // --- Efeitos ---
  useEffect(() => {
    async function carregarDadosCascata() {
      try {
        const [resMontadoras, resFamilias] = await Promise.all([
          axios.get(`${API_URL}/montadoras`),
          axios.get(`${API_URL}/familias`)
        ]);
        setListaMontadoras(resMontadoras.data);
        setListaFamilias(resFamilias.data);
      } catch (error) {
        console.error("Erro ao carregar dados da cascata", error);
      } finally {
        setCarregandoCascata(false);
      }
    }
    carregarDadosCascata();
  }, []);

  useEffect(() => {
    if (montadoraSelecionada.id && familiaSelecionada.id) {
      isClearingRef.current = true;
      setQuery('');
      setPlaca('');
      setMarcaSelecionada('');
      setOrdem('asc');

      buscarResultados({
        tipo: 'guiada',
        pagina: 1,
        montadora_nome: montadoraSelecionada.nome,
        familia_id: familiaSelecionada.id,
        familia_nome: familiaSelecionada.nome
      });
    }
  }, [montadoraSelecionada, familiaSelecionada]);

  useEffect(() => {
    if (isClearingRef.current) {
      isClearingRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (query || placa) {
        setMontadoraSelecionada({ id: '', nome: '' });
        setFamiliaSelecionada({ id: '', nome: '' });

        buscarResultados({
          tipo: 'texto',
          pagina: 1,
          termo: query,
          placa: placa,
          marca: marcaSelecionada,
          ordem: ordem
        });
      } else {
        setResultados([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, placa, marcaSelecionada, ordem]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarSugestoes(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers ---
  const handleMontadoraChange = (id, nome) => {
    setMontadoraSelecionada({ id, nome });
    setFamiliaSelecionada({ id: '', nome: '' });
  };

  const handleFamiliaChange = (id, nome) => {
    setFamiliaSelecionada({ id, nome });
  };

  const handleLinhaClick = (produto) => {
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  // Props para o Campos.jsx
  query, setQuery, placa, setPlaca, marcas, marcaSelecionada,
    setMarcaSelecionada, ordem, setOrdem, sugestoes, mostrarSugestoes,
    carregandoSugestoes, setMostrarSugestoes, dropdownRef,

    // Props para o Cascata.jsx
    listaMontadoras, montadoraSelecionada, handleMontadoraChange, carregandoCascata,
    listaFamilias, familiaSelecionada, handleFamiliaChange

  return (
    <div className="container-fluid">
      <Header
        listaMontadoras={listaMontadoras}
        montadoraSelecionada={montadoraSelecionada}
        handleMontadoraChange={handleMontadoraChange}
        carregandoCascata={carregandoCascata}
        listaFamilias={listaFamilias}
        familiaSelecionada={familiaSelecionada}
        handleFamiliaChange={handleFamiliaChange}
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

      <Banner />
      <Categorias />
      <ProdutoDestaque produtoDestaque="disco de freio" handleLinhaClick={handleLinhaClick} />
      <ProdutoDestaque produtoDestaque="filtro de ar" handleLinhaClick={handleLinhaClick} />

      {/* <Filtro
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

      <Cascata
        listaMontadoras={listaMontadoras}
        montadoraSelecionada={montadoraSelecionada}
        handleMontadoraChange={handleMontadoraChange}
        carregandoCascata={carregandoCascata}
        listaFamilias={listaFamilias}
        familiaSelecionada={familiaSelecionada}
        handleFamiliaChange={handleFamiliaChange}
      /> 
      <Resultados
        resultados={resultados}
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        handleLinhaClick={handleLinhaClick}
        carregandoTabela={carregandoTabela}
        feedbackMessage={feedbackMessage}
        buscarTratados={(pagina) => buscarResultados({
          tipo: (query || placa) ? 'texto' : 'guiada',
          pagina: pagina,
          termo: query,
          placa: placa,
          marca: marcaSelecionada,
          ordem: ordem,
          montadora_nome: montadoraSelecionada.nome,
          familia_id: familiaSelecionada.id,
          familia_nome: familiaSelecionada.nome
        })}
      />*/}

      <Marcas />

      <Footer />
    </div>
  );
}

export default Home;