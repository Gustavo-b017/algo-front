// src/Componentes/Filtro.jsx
import React from 'react';
import '/public/style/filtros.scss';
import Montadora from './Montadora';
import Familia from './Familia';
import SubFamilia from './SubFamilia';

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
    className,
    onClose,
}) {
    // wrapper: id -> (id, nome)
    const onMontadoraChangeIdOnly = (id) => {
        const nome = (listaMontadoras.find(m => String(m.id) === String(id)) || {}).nome || '';
        handleMontadoraChange(id, nome);
    };

    return (
        <div className={`filtros-container ${className}`}>
            <div className="filtros-header">
                <h3>Filtros</h3>
                <button className="fechar-modal-btn" onClick={onClose}>&times;</button>
            </div>

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

            {/* Checkboxes de marcas dinâmicas — mantém id+nome */}
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

            {/* Demais grupos (mock/estilo) inalterados */}
            <div className="filtro-grupo">
                <h4>Categoria da peça</h4>
                <ul>
                    <li><input id="1" type="checkbox" /><label htmlFor='1'>Motor</label></li>
                    <li><input id="2" type="checkbox" /><label htmlFor='2'>Freios</label></li>
                    <li><input id="3" type="checkbox" /><label htmlFor='3'>Suspensão</label></li>
                    <li><input id="4" type="checkbox" /><label htmlFor='4'>Transmissão</label></li>
                    <li><input id="5" type="checkbox" /><label htmlFor='5'>Elétrica</label></li>
                    <li><input id="6" type="checkbox" /><label htmlFor='6'>Carroceria</label></li>
                    <li><input id="7" type="checkbox" /><label htmlFor='7'>Acabamento</label></li>
                    <li><input id="8" type="checkbox" /><label htmlFor='8'>Pneus e Rodas</label></li>
                    <li><input id="9" type="checkbox" /><label htmlFor='9'>Acessórios</label></li>
                </ul>
            </div>

            {/* ... resto igual ... */}
        </div>
    );
}

export default Filtro;
