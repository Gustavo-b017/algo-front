// src/Componentes/Montadora.jsx
// ============================================================================
// Componente: Montadora
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir um <select> para escolha da montadora (fabricante do veículo) na
//   cascata de filtros (Montadora -> Família -> Subfamília).
//
// Diretrizes alinhadas ao back
// - Este componente é **puramente de apresentação** (dumb component):
//   não chama API, não normaliza query e não mapeia parâmetros.
// - A conversão da seleção para os parâmetros do backend deve ocorrer no PAI,
//   que conhece o contrato da API (ex.: { montadora_id, montadora_nome }).
// - IDs podem vir como string/number; o pai deve padronizar ao montar a query.
// - Não alterar nomes de campos esperados pelo back (mantém-se “id” e “nome”
//   em cada item de `listaMontadoras`).
//
// Contrato (recebido via props)
// - listaMontadoras: Array<{ id: string|number, nome: string }>
// - valorSelecionado: string|number (controlado pelo PAI)
// - onChange(id: string, nome: string): notifica o PAI da seleção
// - carregando: boolean (desabilita o controle e mostra rótulo “Carregando...”)
//
// Acessibilidade e UX
// - Usa <select> com <option> descritivas.
// - Desabilita enquanto `carregando` for true.
// - Placeholder inicial informa a etapa “1. Selecione a Montadora”.
// - Layout responsivo por estilos inline simples (mantidos).
//
// Cenários de teste sugeridos
// - Renderização com lista vazia (apenas placeholder).
// - valorSelecionado controlado pelo pai (sincronismo).
// - Estado `carregando` true/false (disabled + label).
// - onChange: verificar se repassa {id, nome} corretos ao pai.
// ============================================================================

import React from 'react';

function Montadora({ listaMontadoras, valorSelecionado, onChange, carregando }) {
  return (
    <div className="campo-montadora" style={{ marginBottom: '20px', maxWidth: '90vw', margin: '0 auto 20px auto' }}>
      <select
        className="custom-select-selected"
        value={valorSelecionado}
        onChange={(e) => onChange(e.target.value, e.target.options[e.target.selectedIndex].text)} // repassa id + nome ao PAI
        disabled={carregando} // bloqueia interação durante carregamento
        style={{ width: '100%', border: '3px solid #ce0f2d' }}
      >
        <option value="">
          {carregando ? 'Carregando...' : '1. Selecione a Montadora'}
        </option>
        {listaMontadoras.map(montadora => (
          <option key={montadora.id} value={montadora.id}>
            {montadora.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Montadora;
