// src/Componentes/Filtro.jsx
// ============================================================================
// Componente: Filtro
// ----------------------------------------------------------------------------
// Propósito
// - Renderiza o painel de filtros da página de resultados, permitindo que o
//   usuário configure: ordenação (campo e direção), família, subfamília e marca.
//
// Diretrizes (alinhadas ao back-end e ao restante do front)
// - Responsabilidade única: apenas UI e emissão de callbacks; toda lógica de
//   busca, paginação, mapeamento para parâmetros da API e sincronização de
//   URL pertence ao contêiner (Resultados.jsx).
// - Previsibilidade: controles são “controlados” pelo pai via props; não há
//   estado interno aqui.
// - Acessibilidade/UX: inclui rótulos claros, desabilita selects durante
//   carregamento e oferece cabeçalho com botão de fechar no modo mobile.
// - Contrato de dados:
//     • listaFamilias: [{ id, nome }]
//     • listaSubFamilias: [{ id, nome, (opcional) count }]
//     • listaMarcasProduto: [{ nome, (opcional) count }]
//     • familiaSelecionada/subFamiliaSelecionada: { id, nome } (strings aceitas)
// - Integração com o back: o pai converte as escolhas de UI em parâmetros de
//   requisição (ex.: { ordenar_por, ordem }, etc.). Este componente apenas
//   devolve a intenção via callbacks.
// - Extensibilidade: prop `className` permite reaproveitar como modal mobile
//   (off-canvas) sem alterar a assinatura de props.
//
// Callbacks esperados
// - onOrdenacaoChange(novaOrdenacaoUI, novaOrdemUI)
// - onFamiliaChange(id, nome)
// - onSubFamiliaChange(id, nome)
// - onMarcaProdutoChange(nomeMarca)
//
// Estados de carregamento
// - carregandoCascata: bloqueia “Família” (e, por consequência, Subfamília)
// - carregandoSubFamilias: bloqueia apenas o select de “Subfamília”
// - carregandoFacetas: bloqueia “Marca” até que facetas estejam disponíveis
// ============================================================================

import React from "react";
import "/public/style/filtros.scss";

export default function Filtro({
    // ordenação (valores de UI; o mapeamento para a API é feito no contêiner)
    ordenacaoAtual,
    ordemAtual,
    onOrdenacaoChange,

    // família/sub (hierarquia principal)
    listaFamilias,
    familiaSelecionada,
    onFamiliaChange,
    listaSubFamilias,
    subFamiliaSelecionada,
    onSubFamiliaChange,
    carregandoCascata,
    carregandoSubFamilias,

    // marcas (faceta dependente da família/sub)
    listaMarcasProduto,
    marcaProdutoSelecionada,
    onMarcaProdutoChange,
    carregandoFacetas,

    // modal mobile/off-canvas
    className = "",
    onClose,
}) {
    // Handler simplificado para os radios de ordenação:
    // notifica o pai com (novaOrdenacaoUI, ordemAtual) — a direção é preservada.
    const handleOrdenacaoRadio = (e) => onOrdenacaoChange(e.target.value, ordemAtual);

    // Alterna direção (asc/desc) somente quando muda; evita renders desnecessários.
    const handleOrdemClick = (ord) => ord !== ordemAtual && onOrdenacaoChange(ordenacaoAtual, ord);

    return (
        // `className` permite reaproveitar o mesmo painel como sidebar (desktop)
        // e como modal (mobile), mudando apenas a classe usada pelo CSS.
        <div className={`filtros-container ${className}`}>
            {/* Cabeçalho visível apenas no mobile (controlado via CSS) */}
            <div className="filtros-header">
                <h3>Filtros</h3>
                {onClose && (
                    <button
                        className="fechar-modal-btn"
                        onClick={onClose}
                        aria-label="Fechar filtros"
                    >
                        &times;
                    </button>
                )}
            </div>

            {/* ==== Ordenação (campo + direção) ================================= */}
            <div className="filtro-grupo">
                <h4>Ordenar</h4>

                {/* Radios para o “campo” de ordenação; a direção é controlada abaixo */}
                <div className="ordenacao-radios">
                    <label>
                        <input
                            type="radio"
                            name="ord"
                            value="relevancia"
                            checked={ordenacaoAtual === 'relevancia'}
                            onChange={handleOrdenacaoRadio}
                        /> Relevância
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="ord"
                            value="menor-preco"
                            checked={ordenacaoAtual === 'menor-preco'}
                            onChange={handleOrdenacaoRadio}
                        /> Menor preço
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="ord"
                            value="maior-preco"
                            checked={ordenacaoAtual === 'maior-preco'}
                            onChange={handleOrdenacaoRadio}
                        /> Maior preço
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="ord"
                            value="melhor-avaliacao"
                            checked={ordenacaoAtual === 'melhor-avaliacao'}
                            onChange={handleOrdenacaoRadio}
                        /> Melhor avaliação
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="ord"
                            value="nome"
                            checked={ordenacaoAtual === 'nome'}
                            onChange={handleOrdenacaoRadio}
                        /> Nome
                    </label>
                </div>

                {/* Toggle da direção (asc/desc). A semântica final (sort/order) é do pai. */}
                <div className="ordem-toggle">
                    <button
                        type="button"
                        className={`ord-btn ${ordemAtual === 'asc' ? 'active' : ''}`}
                        onClick={() => handleOrdemClick('asc')}
                    >
                        Ascendente
                    </button>

                    <button
                        type="button"
                        className={`ord-btn ${ordemAtual === 'desc' ? 'active' : ''}`}
                        onClick={() => handleOrdemClick('desc')}
                    >
                        Descendente
                    </button>
                </div>
            </div>

            {/* ==== Família ====================================================== */}
            <div className="filtro-grupo">
                <h4>Família de produto</h4>

                {/* Select controlado. Desabilita quando a cascata está carregando. */}
                <select
                    value={familiaSelecionada.id}
                    onChange={(e) => {
                        // Resolve (id,nome) localmente para simplificar o pai.
                        const id = e.target.value;
                        const nome =
                            (listaFamilias.find(f => String(f.id) === String(id)) || {}).nome || "";
                        onFamiliaChange(id, nome);
                    }}
                    disabled={carregandoCascata}
                >
                    <option value="">Selecione a família</option>
                    {listaFamilias.map(f => (
                        <option key={f.id} value={f.id}>
                            {f.nome}
                        </option>
                    ))}
                </select>
            </div>

            {/* ==== Subfamília (opcional) ======================================= */}
            <div className="filtro-grupo">
                <h4>Subfamília (opcional)</h4>

                {/* Dependente da família; bloqueia quando ainda carregando. */}
                <select
                    value={subFamiliaSelecionada.id}
                    onChange={(e) => {
                        const id = e.target.value;
                        if (!id) return onSubFamiliaChange("", "");
                        const nome =
                            (listaSubFamilias.find(s => String(s.id) === String(id)) || {}).nome || "";
                        onSubFamiliaChange(id, nome);
                    }}
                    disabled={carregandoSubFamilias || !familiaSelecionada.id}
                >
                    <option value="">Nenhuma subfamília</option>
                    {listaSubFamilias.map(s => (
                        <option key={s.id} value={s.id}>
                            {/* Exibe contador quando disponível (facilita priorização visual). */}
                            {s.nome}{typeof s.count === "number" ? ` (${s.count})` : ""}
                        </option>
                    ))}
                </select>
            </div>

            {/* ==== Marca (faceta) ============================================== */}
            <div className="filtro-grupo">
                <h4>Marca do produto (opcional)</h4>

                {/* Habilita somente após família definida e facetas carregadas. */}
                <select
                    value={marcaProdutoSelecionada}
                    onChange={(e) => onMarcaProdutoChange(e.target.value)}
                    disabled={carregandoFacetas || !familiaSelecionada.id}
                >
                    <option value="">Todas as marcas</option>
                    {listaMarcasProduto.map(m => (
                        <option key={m.nome} value={m.nome}>
                            {/* Contagem opcional vinda do back auxilia o usuário. */}
                            {m.nome}{typeof m.count === "number" ? ` (${m.count})` : ""}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
