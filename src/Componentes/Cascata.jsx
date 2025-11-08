// src/Componentes/Cascata.jsx
// ============================================================================
// Componente: Cascata (seleção hierárquica de filtros de veículo)
// ----------------------------------------------------------------------------
// Propósito
// - Encadear três seletores dependentes (Montadora → Família → Subfamília)
//   para refinar a busca por peças a partir do veículo.
//
// Diretrizes (alinhadas ao back-end)
// - Responsabilidade única: apresentação e delegação de eventos de mudança.
//   O carregamento de dados e a persistência dos filtros acontecem no nível
//   superior (página/contêiner), mantendo o componente “burro” e previsível.
// - Previsibilidade: recebe valores selecionados e listas via props; não
//   busca dados por conta própria; emite mudanças via callbacks de props.
// - Robustez: aceita estados de “carregando” distintos para cascata e subnível,
//   permitindo feedback visual consistente no UI de cada seletor.
// - Acessibilidade/UX: o título contextualiza o bloco; cada seletor é um
//   componente autocontido (Montadora/Familia/SubFamilia) com seus próprios
//   rótulos/aria (definidos neles).
//
// Requisitos de integração
// - CSS: opcionalmente estilizar `.cascata-container` no seu stylesheet.
// - Dados:
//     • listaMontadoras: Array<{ id: string|number, nome: string, ... }>
//     • listaFamilias:   Array<{ id: string|number, nome: string, ... }>
//     • listaSubFamilias:Array<{ id: string|number, nome: string, ... }>
//   Os formatos exatos devem casar com o que os componentes filhos esperam.
// - Selecionados:
//     • montadoraSelecionada: { id: string|number, nome?: string }
//     • familiaSelecionada:   { id: string|number, nome?: string }
//     • subFamiliaSelecionada:{ id: string|number, nome?: string }
// - Callbacks:
//     • handleMontadoraChange(id, nome)
//     • handleFamiliaChange(id, nome)
//     • handleSubFamiliaChange(id, nome)
// - Flags de carregamento:
//     • carregandoCascata: controla skeleton/spinner nos níveis 1 e 2
//     • carregandoSubFamilias: controla skeleton/spinner no nível 3
//
// Observações
// - Ao trocar Montadora, a tela superior deve limpar Família/Subfamília.
// - Ao trocar Família, a tela superior deve carregar Subfamílias válidas e
//   limpar a seleção anterior de Subfamília.
// - Este componente não persiste nada em URL/estado global (isso ocorre fora).
// ============================================================================

import React from 'react';
import Montadora from './Montadora'; // Ajuste o caminho se necessário
import Familia from './Familia';     // Ajuste o caminho se necessário
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
            {/* Título contextual do bloco de filtros hierárquicos */}
            <h4 style={{ textAlign: 'center', margin: '20px 0', color: 'black' }}>
                Busca por Veículo
            </h4>

            {/* Nível 1: Montadora
          - Recebe lista e valor selecionado
          - Emite mudanças via onChange (fornecida pela página) */}
            <Montadora
                listaMontadoras={listaMontadoras}
                valorSelecionado={montadoraSelecionada.id}
                onChange={handleMontadoraChange}
                carregando={carregandoCascata}
            />

            {/* Nível 2: Família
          - Filtra por montadoraId (a responsabilidade de fornecer a lista correta
            é do nível superior/página)
          - Emite mudanças via onChange */}
            <Familia
                listaFamilias={listaFamilias}
                montadoraId={montadoraSelecionada.id}
                valorSelecionadoId={familiaSelecionada.id}
                onChange={handleFamiliaChange}
                carregando={carregandoCascata}
            />

            {/* Nível 3: Subfamília
          - Depende de família selecionada
          - `carregandoSubFamilias` isola o estado de loading deste nível */}
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
