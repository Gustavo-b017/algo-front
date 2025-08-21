// src/Paginas/Home.jsx

import React, { useState, useEffect, useRef } from 'react';
import Montadora from './Montadora.jsx';
import Familia from './Familia.jsx';
import Campos from './Campos.jsx';
import Tabela from './Tabela.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:5000';

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
  const [marcas, setMarcas] = useState([]); // Lista de marcas para o seletor
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [ordem, setOrdem] = useState('asc');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

  const [resultados, setResultados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregandoTabela, setCarregandoTabela] = useState(false);

  const navigate = useNavigate();

  // --- Efeitos ---
  // Busca dados da cascata (uma vez)
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

  // Dispara a BUSCA GUIADA (Atualizado)
  useEffect(() => {
    if (montadoraSelecionada.id && familiaSelecionada.id) {
      setQuery('');
      buscarResultados({ tipo: 'guiada', pagina: 1 });
    }
  }, [montadoraSelecionada, familiaSelecionada]);

  // Dispara a BUSCA POR TEXTO
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        setMontadoraSelecionada({ id: '', nome: '' });
        setFamiliaId('');
        buscarResultados({ tipo: 'texto', pagina: 1 });
      } else {
        setResultados([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, placa, marcaSelecionada, ordem]); // Agora depende de todos os filtros

  // Lógica do AUTOCOMPLETE
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

  // --- Funções ---
  const buscarResultados = (config) => {
    setCarregandoTabela(true);
    let params = new URLSearchParams({ pagina: config.pagina });

    if (config.tipo === 'guiada') {
      params.append('montadora_nome', montadoraSelecionada.nome);
      params.append('familia_id', familiaSelecionada.id);
      params.append('familia_nome', familiaSelecionada.nome); // <-- MUDANÇA: enviamos o nome
    } else {
      params.append('termo', query);
      params.append('placa', placa);
      params.append('marca', marcaSelecionada);
      params.append('ordem', ordem);
    }

    axios.get(`${API_URL}/pesquisar?${params.toString()}`)
      .then(res => {
        setResultados(res.data.dados || []);
        setMarcas(res.data.marcas || []); // Atualiza as marcas disponíveis
        setPaginaAtual(res.data.pagina || 1);
        setTotalPaginas(res.data.total_paginas || 1);
      })
      .catch(err => console.error("Erro na busca", err))
      .finally(() => setCarregandoTabela(false));
  };

  const handleMontadoraChange = (id, nome) => {
    setMontadoraSelecionada({ id, nome });
    setFamiliaSelecionada({ id: '', nome: '' }); // <-- MUDANÇA
    setResultados([]);
  };

  const handleFamiliaChange = (id, nome) => { // <-- NOVA FUNÇÃO
    setFamiliaSelecionada({ id, nome });
  };

  const handleLinhaClick = (produto) => {
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <h4 style={{ textAlign: 'center', margin: '20px 0', color: 'black' }}>Busca por Veículo</h4>
        <Montadora
          listaMontadoras={listaMontadoras}
          valorSelecionado={montadoraSelecionada.id}
          onChange={handleMontadoraChange}
          carregando={carregandoCascata}
        />

        <Familia
          listaFamilias={listaFamilias}
          montadoraId={montadoraSelecionada.id}
          valorSelecionadoId={familiaSelecionada.id} // <-- Correção 1
          onChange={handleFamiliaChange}             // <-- Correção 2
          carregando={carregandoCascata}
        />

        <hr style={{ margin: '30px auto', borderColor: 'black' }} />
        <h4 style={{ textAlign: 'center', margin: '20px 0', color: 'black' }}>Busca por Texto</h4>
        <Campos
          query={query} setQuery={setQuery}
          placa={placa} setPlaca={setPlaca}
          marcas={marcas}
          marcaSelecionada={marcaSelecionada} setMarcaSelecionada={setMarcaSelecionada}
          ordem={ordem} setOrdem={setOrdem}
          sugestoes={sugestoes}
          mostrarSugestoes={mostrarSugestoes} setMostrarSugestoes={setMostrarSugestoes}
          carregandoSugestoes={carregandoSugestoes}
        />
      </div>

      <Tabela
        resultados={resultados}
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        handleLinhaClick={handleLinhaClick}
        carregandoTabela={carregandoTabela}
      />
    </div>
  );
}

export default Home;