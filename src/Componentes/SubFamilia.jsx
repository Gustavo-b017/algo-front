// src/Componentes/SubFamilia.jsx
// ============================================================================
// Componente: SubFamilia
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir um <select> para refinamento por Subfamília, condicionado à família
//   previamente selecionada. É um componente **apresentacional/estateless**.
//
// Diretrizes alinhadas ao back
// - Mantém contrato simples e coeso: recebe lista já tratada pelo backend
//   (ou pelo container) e apenas renderiza; não faz transformações.
// - Não acopla regras de negócio nem chama API diretamente.
// - Preserva a nomenclatura e o shape esperados pelo back: { id, nome }.
//
// Contrato (props)
// - listaSubFamilias: Array<{ id: string|number, nome: string }>
// - valorSelecionadoId: string|number (valor atual do select)
// - onChange: (id: string|number, nome: string) => void
// - carregando: boolean (desabilita interação enquanto carrega)
// - familiaId: string|number | falsy (se não houver família, oculta o campo)
//
// UX/Acessibilidade
// - Campo é oculto se não existir `familiaId` (fluxo guiado).
// - Placeholder contextual muda entre “Carregando…”, “Refinar…” e
//   “Nenhuma subfamília disponível”.
// - `disabled` previne interação enquanto carrega ou quando a lista está vazia.
//
// Performance
// - Renderização direta com `map` e `key` estável (id).
// - Sem estado interno → re-render determinado apenas por props.
//
// Testes sugeridos
// - Render: retorna `null` quando `familiaId` é falsy.
// - Habilitado/Desabilitado: respeita `carregando` e lista vazia.
// - onChange: propaga (id, nome) corretos.
// ============================================================================

import React from 'react';

function SubFamilia({ listaSubFamilias, valorSelecionadoId, onChange, carregando, familiaId }) {
  // Se nenhuma família foi escolhida, não exibe o campo de Subfamília.
  if (!familiaId) return null;

  // Propaga id e nome legíveis para o container/página.
  const handleChange = (e) => {
    const id = e.target.value;
    const nome = e.target.options[e.target.selectedIndex].text;
    onChange(id, nome);
  };

  // Sinaliza se existem opções válidas a renderizar.
  const hasSubFamilias = listaSubFamilias.length > 0;

  return (
    <div
      className="campo-subfamilia"
      style={{ marginBottom: '20px', maxWidth: '90vw', margin: '0 auto 20px auto' }}
    >
      <select
        className="custom-select-selected"
        value={valorSelecionadoId}
        onChange={handleChange}
        // Desabilita enquanto carrega ou quando não há opções.
        disabled={carregando || !hasSubFamilias}
        style={{ width: '100%', border: '3px solid #f2a900' }}
      >
        {/* Placeholder contextual conforme estado atual */}
        <option value="">
          {carregando
            ? 'Carregando...'
            : (hasSubFamilias
                ? '3. Refinar por Subfamília (Opcional)'
                : 'Nenhuma subfamília disponível')}
        </option>

        {/* Opções de Subfamília (shape do back: { id, nome }) */}
        {listaSubFamilias.map(sub => (
          <option key={sub.id} value={sub.id}>{sub.nome}</option>
        ))}
      </select>
    </div>
  );
}

export default SubFamilia;
