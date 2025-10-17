// src/Componentes/Filtro.jsx
import React from "react";
import "/public/style/filtros.scss";

export default function Filtro({
    // ordenação
    ordenacaoAtual,
    ordemAtual,
    onOrdenacaoChange,

    // família/sub
    listaFamilias,
    familiaSelecionada,
    onFamiliaChange,
    listaSubFamilias,
    subFamiliaSelecionada,
    onSubFamiliaChange,
    carregandoCascata,
    carregandoSubFamilias,

    // marcas
    listaMarcasProduto,
    marcaProdutoSelecionada,
    onMarcaProdutoChange,
    carregandoFacetas,

    // >>> NOVO: para modal mobile
    className = "",
    onClose,
}) {
    const handleOrdenacaoRadio = (e) => onOrdenacaoChange(e.target.value, ordemAtual);
    const handleOrdemClick = (ord) => ord !== ordemAtual && onOrdenacaoChange(ordenacaoAtual, ord);

    return (
        <div className={`filtros-container ${className}`}>
            {/* header só aparece no mobile (CSS esconde no desktop) */}
            <div className="filtros-header">
                <h3>Filtros</h3>
                {onClose && (
                    <button className="fechar-modal-btn" onClick={onClose} aria-label="Fechar filtros">
                        &times;
                    </button>
                )}
            </div>

            {/* ==== Ordenação ==== */}
            <div className="filtro-grupo">
                <h4>Ordenar</h4>
                <div className="ordenacao-radios">
                    <label><input type="radio" name="ord" value="relevancia" checked={ordenacaoAtual === 'relevancia'} onChange={handleOrdenacaoRadio} /> Relevância</label>
                    <label><input type="radio" name="ord" value="menor-preco" checked={ordenacaoAtual === 'menor-preco'} onChange={handleOrdenacaoRadio} /> Menor preço</label>
                    <label><input type="radio" name="ord" value="maior-preco" checked={ordenacaoAtual === 'maior-preco'} onChange={handleOrdenacaoRadio} /> Maior preço</label>
                    <label><input type="radio" name="ord" value="melhor-avaliacao" checked={ordenacaoAtual === 'melhor-avaliacao'} onChange={handleOrdenacaoRadio} /> Melhor avaliação</label>
                    <label><input type="radio" name="ord" value="nome" checked={ordenacaoAtual === 'nome'} onChange={handleOrdenacaoRadio} /> Nome</label>
                </div>
                <div className="ordem-toggle">
                    <button type="button" className={`ord-btn ${ordemAtual === 'asc' ? 'active' : ''}`} onClick={() => handleOrdemClick('asc')}>Ascendente</button>
                    <button type="button" className={`ord-btn ${ordemAtual === 'desc' ? 'active' : ''}`} onClick={() => handleOrdemClick('desc')}>Descendente</button>
                </div>
            </div>

            {/* ==== Família ==== */}
            <div className="filtro-grupo">
                <h4>Família de produto</h4>
                <select
                    value={familiaSelecionada.id}
                    onChange={(e) => {
                        const id = e.target.value;
                        const nome = (listaFamilias.find(f => String(f.id) === String(id)) || {}).nome || "";
                        onFamiliaChange(id, nome);
                    }}
                    disabled={carregandoCascata}
                >
                    <option value="">Selecione a família</option>
                    {listaFamilias.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
            </div>

            {/* ==== Subfamília ==== */}
            <div className="filtro-grupo">
                <h4>Subfamília (opcional)</h4>
                <select
                    value={subFamiliaSelecionada.id}
                    onChange={(e) => {
                        const id = e.target.value;
                        if (!id) return onSubFamiliaChange("", "");
                        const nome = (listaSubFamilias.find(s => String(s.id) === String(id)) || {}).nome || "";
                        onSubFamiliaChange(id, nome);
                    }}
                    disabled={carregandoSubFamilias || !familiaSelecionada.id}
                >
                    <option value="">Nenhuma subfamília</option>
                    {listaSubFamilias.map(s => <option key={s.id} value={s.id}>{s.nome}{typeof s.count === "number" ? ` (${s.count})` : ""}</option>)}
                </select>
            </div>

            {/* ==== Marca ==== */}
            <div className="filtro-grupo">
                <h4>Marca do produto (opcional)</h4>
                <select
                    value={marcaProdutoSelecionada}
                    onChange={(e) => onMarcaProdutoChange(e.target.value)}
                    disabled={carregandoFacetas || !familiaSelecionada.id}
                >
                    <option value="">Todas as marcas</option>
                    {listaMarcasProduto.map(m => <option key={m.nome} value={m.nome}>{m.nome}{typeof m.count === "number" ? ` (${m.count})` : ""}</option>)}
                </select>
            </div>
        </div>
    );
}
