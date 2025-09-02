import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Componentes/Header.jsx';
import Categorias from "../Componentes/Categorias.jsx"
import Filtro from '../Componentes/Filtro.jsx';
import CardsProdutos from '../Componentes/CardsProdutos.jsx';
import Footer from '../Componentes/Footer.jsx';
import Cascata from '../Componentes/Cascata.jsx';
import '../../public/style/resultados.scss';

const API_URL = 'http://127.0.0.1:5000';

function Resultados() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('termo') || '');
  const [placa, setPlaca] = useState(searchParams.get('placa') || '');

  const [listaMontadoras, setListaMontadoras] = useState([]);
  const [listaFamilias, setListaFamilias] = useState([]);
  const [listaSubFamilias, setListaSubFamilias] = useState([]);
  const [montadoraSelecionada, setMontadoraSelecionada] = useState({ id: '', nome: searchParams.get('marca') || '' });
  const [familiaSelecionada, setFamiliaSelecionada] = useState({ id: searchParams.get('familia_id') || '', nome: searchParams.get('familia_nome') || '' });
  const [subFamiliaSelecionada, setSubFamiliaSelecionada] = useState({ id: searchParams.get('subfamilia_id') || '', nome: searchParams.get('subfamilia_nome') || '' });
  const [carregandoCascata, setCarregandoCascata] = useState(false);
  const [carregandoSubFamilias, setCarregandoSubFamilias] = useState(false);

  // ... (outros estados como 'resultados', 'paginaAtual', etc. permanecem os mesmos)
  const [resultados, setResultados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregandoTabela, setCarregandoTabela] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const dropdownRef = useRef(null);


  useEffect(() => {
    async function carregarDadosCascata() {
      setCarregandoCascata(true);
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
    if (familiaSelecionada.id) {
      setCarregandoSubFamilias(true);
      setListaSubFamilias([]); // Limpa a lista antes de buscar novas
      axios.get(`${API_URL}/familias/${familiaSelecionada.id}/subfamilias`)
        .then(res => setListaSubFamilias(res.data))
        .catch(err => console.error("Erro ao buscar subfamílias", err))
        .finally(() => setCarregandoSubFamilias(false));
    } else {
      setListaSubFamilias([]);
    }
  }, [familiaSelecionada.id]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (params.termo || (params.marca && params.familia_id)) {
      setCarregandoTabela(true);
      axios.get(`${API_URL}/pesquisar`, { params })
        .then(res => {
          setResultados(res.data.dados || []);
          setPaginaAtual(res.data.pagina || 1);
          setTotalPaginas(res.data.total_paginas || 1);
          setFeedbackMessage(res.data.mensagem || '');
        })
        .catch(err => console.error("Erro na busca", err))
        .finally(() => setCarregandoTabela(false));
    }
  }, [searchParams]);

  const handleLinhaClick = (produto) => {
    const params = new URLSearchParams({ id: produto.id, nomeProduto: produto.nome });
    navigate(`/produto?${params.toString()}`);
  };

  const handlePageChange = (pagina) => {
    setSearchParams(prev => {
      prev.set('pagina', pagina.toString());
      return prev;
    });
  };

  const handleSearchSubmit = (termo, placa) => {
    setSearchParams({ termo, placa });
  };

  const handleMontadoraChange = (id, nome) => {
    setMontadoraSelecionada({ id, nome });
    setFamiliaSelecionada({ id: '', nome: '' });
    setSubFamiliaSelecionada({ id: '', nome: '' });
  };

  // ATUALIZADO: Dispara a busca principal
  const handleFamiliaChange = (id, nome) => {
    setFamiliaSelecionada({ id, nome });
    setSubFamiliaSelecionada({ id: '', nome: '' }); // Limpa a seleção de subfamília

    if (montadoraSelecionada.nome && id) {
      // Dispara a busca apenas com montadora e família
      setSearchParams({
        marca: montadoraSelecionada.nome,
        familia_id: id,
        familia_nome: nome
      });
    }
  };

  // ATUALIZADO: Dispara a busca refinada (ou a principal, se o usuário desmarcar)
  const handleSubFamiliaChange = (id, nome) => {
    setSubFamiliaSelecionada({ id, nome });

    // Garante que os outros filtros essenciais ainda estão lá
    if (montadoraSelecionada.nome && familiaSelecionada.id) {
      setSearchParams({
        marca: montadoraSelecionada.nome,
        familia_id: familiaSelecionada.id,
        familia_nome: familiaSelecionada.nome,
        // Adiciona ou remove os parâmetros da subfamília
        ...(id && { subfamilia_id: id, subfamilia_nome: nome })
      });
    }
  };

  return (
    <div className="container-fluid">
      <Header
        query={query} setQuery={setQuery}
        placa={placa} setPlaca={setPlaca}
        dropdownRef={dropdownRef}
        onSearchSubmit={handleSearchSubmit}
      />

      <Categorias />

      <Cascata
        listaMontadoras={listaMontadoras}
        montadoraSelecionada={montadoraSelecionada}
        handleMontadoraChange={handleMontadoraChange}
        carregandoCascata={carregandoCascata}
        listaFamilias={listaFamilias}
        familiaSelecionada={familiaSelecionada}
        handleFamiliaChange={handleFamiliaChange}
        listaSubFamilias={listaSubFamilias}
        subFamiliaSelecionada={subFamiliaSelecionada}
        handleSubFamiliaChange={handleSubFamiliaChange}
        carregandoSubFamilias={carregandoSubFamilias}
      />

      <main className='search-page-container'>

        <aside className="filters-sidebar">
          <Filtro />
        </aside>

        <section className="search-results">
          <CardsProdutos
            resultados={resultados}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            handleLinhaClick={handleLinhaClick}
            carregandoTabela={carregandoTabela}
            feedbackMessage={feedbackMessage}
            buscarTratados={handlePageChange}
          />
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default Resultados;