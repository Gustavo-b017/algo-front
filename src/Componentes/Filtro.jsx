// src/Componentes/Filtro.jsx
import React from 'react';
import '/public/style/filtros.scss';
import Montadora from './Montadora';
import Familia from './Familia';
import SubFamilia from './SubFamilia';

// Label amigável para cada critério
const ORDER_OPTIONS = [
    { value: 'score', label: 'Relevância' },
    { value: 'menor_preco', label: 'Menor preço' },
    { value: 'maior_preco', label: 'Maior preço' },
    { value: 'mais_bem_avaliados', label: 'Melhor avaliação' },
];

function Filtro({
    listaMontadoras,
    montadoraSelecionada,
    handleMontadoraChange,
    carregandoCascata,
    listaFamilias,
    familiaSelecionada,
    handleFamiliaChange,
    listaSubFamilias,
    subFamiliaSelecionada,
    handleSubFamiliaChange,
    carregandoSubFamilias,
    // novo: ordenação
    ordenarPor,
    ordem,
    onChangeOrdenarPor,
    onChangeOrdem,
    // ui
    className,
    onClose,
}) {
    // wrapper: id -> (id, nome)
    const onMontadoraChangeIdOnly = (id) => {
        const nome =
            (listaMontadoras.find((m) => String(m.id) === String(id)) || {}).nome || '';
        handleMontadoraChange(id, nome);
    };

    return (
        <div className={`filtros-container ${className}`}>
            <div className="filtros-header">
                <h3>Filtros</h3>
                <button className="fechar-modal-btn" onClick={onClose}>
                    &times;
                </button>
            </div>

            {/* ===== ORDENAR (novo) ===== */}
            <div className="filtro-grupo filtro-ordenacao">
                <h4>Ordenar</h4>

                <div className="ordenacao-list">
                    {ORDER_OPTIONS.map((opt) => {
                        const id = `ord-${opt.value}`;
                        return (
                            <div className="ordenacao-item" key={opt.value}>
                                <input
                                    type="radio"
                                    id={id}
                                    name="ordenar_por"
                                    value={opt.value}
                                    checked={ordenarPor === opt.value}
                                    onChange={(e) => onChangeOrdenarPor(e.target.value)}
                                />
                                <label htmlFor={id}>{opt.label}</label>
                            </div>
                        );
                    })}
                </div>

                <div className="ordem-toggle" role="group" aria-label="Direção da ordem">
                    <button
                        type="button"
                        className={ordem === 'asc' ? 'ativo' : ''}
                        onClick={() => onChangeOrdem('asc')}
                    >
                        Ascendente
                    </button>
                    <button
                        type="button"
                        className={ordem === 'desc' ? 'ativo' : ''}
                        onClick={() => onChangeOrdem('desc')}
                    >
                        Descendente
                    </button>
                </div>
            </div>

            {/* ===== CASCATA ===== */}
            <h4>Pesquisa por marca de carro:</h4>
            <Montadora
                listaMontadoras={listaMontadoras}
                valorSelecionado={montadoraSelecionada.id}
                onChange={onMontadoraChangeIdOnly}
                carregando={carregandoCascata}
            />

            <Familia
                listaFamilias={listaFamilias}
                montadoraId={montadoraSelecionada.id}
                valorSelecionadoId={familiaSelecionada.id}
                onChange={handleFamiliaChange}
                carregando={carregandoCascata}
            />

            <SubFamilia
                listaSubFamilias={listaSubFamilias}
                familiaId={familiaSelecionada.id}
                valorSelecionadoId={subFamiliaSelecionada.id}
                onChange={handleSubFamiliaChange}
                carregando={carregandoSubFamilias}
            />

            {/* Exemplo de grupo (mantive) */}
            <div className="filtro-grupo">
                <h4>Marcas</h4>
                <ul>
                    {listaMontadoras.map((m) => (
                        <li key={m.id}>
                            <input
                                id={`montadora-${m.id}`}
                                type="checkbox"
                                onChange={() => handleMontadoraChange(m.id, m.nome)}
                            />
                            <label htmlFor={`montadora-${m.id}`}>{m.nome}</label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Filtro;
