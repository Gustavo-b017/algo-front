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

  const dropdownRef = useRef(null); // A referência para o componente Campos
  const navigate = useNavigate();

  // --- Funções ---
  const buscarResultados = (config) => {
    setCarregandoTabela(true);
    let params = new URLSearchParams({ pagina: config.pagina });

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
      })
      .catch(err => console.error("Erro na busca", err))
      .finally(() => setCarregandoTabela(false));
  };

  // --- Efeitos ---
  // Efeito 1: Busca dados da cascata (uma vez)
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

  // Efeito 2: Dispara a BUSCA GUIADA (Cascata)
  useEffect(() => {
    if (montadoraSelecionada.id && familiaSelecionada.id) {
      // Limpa os estados da busca por texto
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

  // Efeito 3: Dispara a BUSCA POR TEXTO (debounce para performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query || placa) {
        // Limpa os estados da busca por cascata
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

  // Efeito 4: Lógica do AUTOCOMPLETE
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

  // Efeito 5: Lógica de fechar a caixa de sugestões ao clicar fora (ESSA É A LÓGICA QUE FALTAVA)
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
          valorSelecionadoId={familiaSelecionada.id}
          onChange={handleFamiliaChange}
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
          dropdownRef={dropdownRef}
        />
      </div>

      <Tabela
        resultados={resultados}
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        handleLinhaClick={handleLinhaClick}
        carregandoTabela={carregandoTabela}
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
      />
    </div>
  );
}

export default Home;