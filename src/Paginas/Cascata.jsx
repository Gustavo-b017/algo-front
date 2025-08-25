// src/Paginas/Cascata.jsx

import React from 'react';
import Montadora from './Montadora.jsx';
import Familia from './Familia.jsx';

function Cascata({
    listaMontadoras,
    montadoraSelecionada,
    handleMontadoraChange,
    carregandoCascata,
    listaFamilias,
    familiaSelecionada,
    handleFamiliaChange
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
        </div>
    );
}

export default Cascata;