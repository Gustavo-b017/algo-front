import React from 'react';
import '/public/style/filtros.scss';
import Montadora from './Montadora';
import Familia from './Familia';
import SubFamilia from './SubFamilia';


function Filtro({
    setQuery,
    setMostrarSugestoes,

    listaMontadoras,
    montadoraSelecionada,
    onMontadoraChange,

    handleMontadoraChange,
    carregandoCascata,
    listaFamilias,
    familiaSelecionada,
    handleFamiliaChange,
    listaSubFamilias,        // Novas props
    subFamiliaSelecionada,   // Novas props
    handleSubFamiliaChange,  // Novas props
    carregandoSubFamilias,   // Novas props
    className,
    onClose,

    onFiltroChange, // NOVO: Callback para notificar o componente pai sobre as mudanças
    filtrosIniciais // NOVO: Recebe os filtros iniciais do componente pai

}) {

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

            <SubFamilia
                listaSubFamilias={listaSubFamilias}
                familiaId={familiaSelecionada.id}
                valorSelecionadoId={subFamiliaSelecionada.id}
                onChange={handleSubFamiliaChange}
                carregando={carregandoSubFamilias}
            />

            {/* NOVO FILTRO: MARCAS DINÂMICAS */}
            <div className="filtro-grupo">
                <h4>Marcas</h4>
                <ul>
                    {listaMontadoras.map((montadora) => (
                        <li key={montadora.id}>
                            <input
                                id={`montadora-${montadora.id}`}
                                type="checkbox"
                                // Você pode adicionar um `checked` aqui se tiver o estado de seleção
                                onChange={() => onMontadoraChange(montadora)}
                            />
                            <label htmlFor={`montadora-${montadora.id}`}>{montadora.nome}</label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Filtro: Categoria da Peça */}
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

            {/* Filtro: Preço */}
            <div className="filtro-grupo">
                <h4>Preço</h4>
                <div className="filtro-input-group">
                    <input type="text" placeholder="De R$0,00" />
                    <input type="text" placeholder="Até R$2500,00" />
                </div>
                <button className="aplicar-btn">Aplicar</button>
            </div>

            {/* Filtro: Ano do Veículo */}
            <div className="filtro-grupo">
                <h4>Ano do veículo</h4>
                <div className="filtro-input-group">
                    <input type="text" placeholder="De 2010" />
                    <input type="text" placeholder="Até 2012" />
                </div>
                <button className="aplicar-btn">Aplicar</button>
            </div>

            {/* Filtro: Marca */}
            <div className="filtro-grupo">
                <h4>Marca</h4>
                <ul>
                    <li><input id="10" type="checkbox" /><label htmlFor='10'>HONDA</label></li>
                    <li><input id="11" type="checkbox" /><label htmlFor='11'>KIA</label></li>
                    <li><input id="12" type="checkbox" /><label htmlFor='12'>HYUNDAI</label></li>
                    <li><input id="13" type="checkbox" /><label htmlFor='13'>VOLKSWAGEN</label></li>
                    <li><input id="14" type="checkbox" /><label htmlFor='14'>FORD</label></li>
                    <li><input id="15" type="checkbox" /><label htmlFor='15'>MITSUBISHI</label></li>
                    <li><input id="16" type="checkbox" /><label htmlFor='16'>MERCEDES-BENZ</label></li>
                    <li><input id="17" type="checkbox" /><label htmlFor='17'>BMW</label></li>
                    <li><input id="18" type="checkbox" /><label htmlFor='18'>TOYOTA</label></li>
                    <li><input id="19" type="checkbox" /><label htmlFor='19'>LEXUS</label></li>
                    <li><input id="20" type="checkbox" /><label htmlFor='20'>INFINITI</label></li>
                    <li><input id="21" type="checkbox" /><label htmlFor='21'>MAZDA</label></li>
                </ul>
            </div>


            {/* Filtro: Fabricante */}
            <div className="filtro-grupo">
                <h4>Fabricante</h4>
                <ul>
                    <li><label><input type="checkbox" />Bosch</label></li>
                    <li><label><input type="checkbox" />Magneti Marelli</label></li>
                    <li><label><input type="checkbox" />Delphi</label></li>
                    <li><label><input type="checkbox" />Cofap</label></li>
                    <li><label><input type="checkbox" />Valeo</label></li>
                </ul>
            </div>
        </div>
    );
}

export default Filtro;