import React from 'react';
import Montadora from './Montadora'; // Ajuste o caminho se necessário
import Familia from './Familia'; // Ajuste o caminho se necessário
import SubFamilia from './SubFamilia'; // Importa o novo componente

function Cascata({
    listaMontadoras,
    montadoraSelecionada,
    handleMontadoraChange,
    carregandoCascata,
    listaFamilias,
    familiaSelecionada,
    handleFamiliaChange,
    listaSubFamilias,        // Novas props
    subFamiliaSelecionada,   // Novas props
    handleSubFamiliaChange,  // Novas props
    carregandoSubFamilias    // Novas props
}) {
    return (
        <div className="cascata-container">
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
            <SubFamilia
                listaSubFamilias={listaSubFamilias}
                familiaId={familiaSelecionada.id}
                valorSelecionadoId={subFamiliaSelecionada.id}
                onChange={handleSubFamiliaChange}
                carregando={carregandoSubFamilias}
            />
        </div>
    );
}

export default Cascata;