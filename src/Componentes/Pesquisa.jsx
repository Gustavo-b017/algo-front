// src/Componentes/Pesquisa.jsx
// ============================================================================
// Componente: Pesquisa
// ----------------------------------------------------------------------------
// Objetivo
// - Campo de busca com autocomplete e filtro opcional por placa.
// - Ao submeter (Enter ou clique numa sugestão), navega para /resultados
//   repassando os parâmetros esperados pelo backend.
//
// Diretrizes arquiteturais (alinhadas ao back)
// - Integração com API: usa GET {API_URL}/autocomplete com query param `prefix`,
//   conforme contrato do backend. A busca principal é feita pela própria rota
//   /resultados do front, que consumirá o endpoint GET /pesquisar no back.
// - UX resiliente: debounce de 300ms para reduzir chamadas; fallback de lista
//   vazia e mensagem “Nenhuma sugestão”; loading durante a consulta.
// - Segurança/estabilidade: leitura de base via env (Vite) e tratamento de erro
//   não bloqueante (mantém a UI funcional, apenas sem sugestões).
// - Compatibilidade: este componente é autocontido (state interno) e não depende
//   de props. Caso o <Header> forneça props (query/placa), serão ignoradas,
//   preservando funcionamento sem efeitos colaterais (decisão intencional para
//   não alterar a assinatura original).
//
// Contratos e parâmetros do backend
// - Autocomplete: GET /autocomplete?prefix=<string>
// - Pesquisa (executada pela página de resultados):
//   /resultados?termo=<string>&placa=<string>
//   Observação: a placa é normalizada para UPPERCASE antes do push de rota.
//
// Testes sugeridos
// - Digitar e aguardar 300ms: deve exibir sugestões.
// - Selecionar uma sugestão: deve navegar para /resultados com termo+placa.
// - Submeter sem sugestões: deve navegar com o termo digitado.
// - Campo de placa: deve ser convertido para maiúsculas.
// ============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/public/style/campos.scss';

// Base do backend (Vite). Mantém compatibilidade com deploys variados.
const API_URL = import.meta.env.VITE_API_URL;

function Pesquisa() {
    // ------------------------------------------------------------------------
    // Estado local: termo, placa e controle do dropdown de sugestões
    // ------------------------------------------------------------------------
    const [query, setQuery] = useState('');
    const [placa, setPlaca] = useState('DME8I14'); // valor inicial ilustrativo
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

    // Ref do dropdown (útil se futuramente houver click-outside/posicionamento)
    const dropdownRef = useRef(null);

    // Navegação programática para empurrar /resultados com a querystring
    const navigate = useNavigate();

    // ------------------------------------------------------------------------
    // Efeito: Autocomplete com debounce de 300ms
    // - Consulta GET /autocomplete?prefix=<query>
    // - Em caso de erro, mantém a UI estável e limpa sugestões
    // ------------------------------------------------------------------------
    useEffect(() => {
        if (!query) {
            setSugestoes([]);
            setMostrarSugestoes(false);
            return;
        }
        const t = setTimeout(() => {
            setCarregandoSugestoes(true);
            axios
                .get(`${API_URL}/autocomplete`, { params: { prefix: query } })
                .then(res => setSugestoes(res.data?.sugestoes || []))
                .catch(() => setSugestoes([]))
                .finally(() => setCarregandoSugestoes(false));
        }, 300); // debounce
        return () => clearTimeout(t);
    }, [query]);

    // ------------------------------------------------------------------------
    // onSearchSubmit
    // - Centraliza a construção dos parâmetros para /resultados
    // - Normaliza a placa para UPPERCASE (compatível com back)
    // ------------------------------------------------------------------------
    const onSearchSubmit = (termo, placaValor) => {
        const params = new URLSearchParams();
        if (termo) params.set('termo', termo);
        if (placaValor) params.set('placa', placaValor.toUpperCase());
        if ([...params.keys()].length) {
            navigate(`/resultados?${params.toString()}`);
        }
    };

    // ------------------------------------------------------------------------
    // handleSelect
    // - Ação ao clicar numa sugestão: preenche input, fecha lista e navega
    // ------------------------------------------------------------------------
    const handleSelect = (s) => {
        setQuery(s);
        setMostrarSugestoes(false);
        onSearchSubmit(s, placa);
    };

    // ------------------------------------------------------------------------
    // handleSubmit
    // - Submissão “silenciosa” do formulário (apenas navega)
    // ------------------------------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearchSubmit(query, placa);
    };

    return (
        <form className="busca" onSubmit={handleSubmit}>
            {/* Campo principal de busca (com toggle de sugestões) */}
            <div className="campo-busca" ref={dropdownRef}>
                <input
                    type="text"
                    className="campo-input"
                    placeholder="Buscar por nome do produto..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setMostrarSugestoes(true)}
                />
                <button
                    type="button"
                    className={`toggle-btn ${mostrarSugestoes ? 'aberto' : ''}`}
                    title="Alternar sugestões"
                    onClick={() => setMostrarSugestoes(v => !v)}
                >
                    {mostrarSugestoes ? '✕' : '☰'}
                </button>

                {/* Dropdown de sugestões (condicional) */}
                {mostrarSugestoes && query && (
                    <ul className="sugestoes-list">
                        {carregandoSugestoes ? (
                            <li className="loading">Carregando...</li>
                        ) : sugestoes.length ? (
                            sugestoes.map((s, i) => (
                                <li key={i} className="sugestao">
                                    <button type="button" onClick={() => handleSelect(s)}>{s}</button>
                                </li>
                            ))
                        ) : (
                            <li className="loading">Nenhuma sugestão.</li>
                        )}
                    </ul>
                )}
            </div>

            {/* Campo opcional de placa.
               Observação: a normalização para maiúsculas é feita aqui e também
               no submit (defensivo), garantindo consistência com o backend. */}
            <div className="campo-placa">
                <input
                    type="text"
                    className="campo-input"
                    placeholder="Placa (opcional)"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                />
            </div>

            {/* Botão “invisível” para permitir submit por Enter no input. */}
            <button type="submit" style={{ display: 'none' }} />
        </form>
    );
}

export default Pesquisa;
