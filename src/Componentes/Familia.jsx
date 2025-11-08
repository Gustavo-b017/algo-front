// src/Componentes/Familia.jsx
// ============================================================================
// Componente: Familia
// ----------------------------------------------------------------------------
// Propósito
// - Exibir um <select> de famílias (categorias) dependente da montadora escolhida.
// - Disparar para o componente pai o par (id, nome) da família selecionada.
//
// Diretrizes (em linha com o back-end e demais componentes)
// - Responsabilidade única: apenas UI + emissão de evento `onChange(id, nome)`.
//   A lógica de busca, URL e estado global fica na página/contêiner.
// - Previsibilidade: se `montadoraId` não estiver definido, não renderiza (null).
// - Acessibilidade/UX: utiliza <select> nativo, placeholder, estado `disabled`
//   quando `carregando` é verdadeiro.
// - Contrato de dados: `listaFamilias` deve ser um array de objetos com
//   { id, nome }. O `id` pode chegar como string; normalize no pai se
//   precisar de número.
// - Extensibilidade: estilos via classes e inline mínimos; pode ser trocado
//   por um componente de UI mais rico sem alterar a assinatura.
// ============================================================================

import React from 'react';

function Familia({ listaFamilias, montadoraId, valorSelecionadoId, onChange, carregando }) {
  // Guard clause: se nenhuma montadora foi selecionada, não mostra o campo.
  if (!montadoraId) return null;

  // Handler centralizado: envia (id, nome) ao pai.
  const handleChange = (e) => {
    const id = e.target.value; // Mantém string para máxima compatibilidade.
    const nome = e.target.options[e.target.selectedIndex].text; // Rótulo visível.
    onChange(id, nome);
  };

  return (
    <div
      className="campo-familia"
      // Estilos de layout simples (mantidos como no original).
      style={{ marginBottom: '20px', maxWidth: '90vw', margin: '0 auto 20px auto' }}
    >
      <select
        className="custom-select-selected"
        value={valorSelecionadoId}
        onChange={handleChange}
        disabled={carregando}                 // Desabilita durante carregamento.
        style={{ width: '100%', border: '3px solid #022e4c' }}
        // Observação: se necessário, adicione aria-busy/aria-live no contêiner.
      >
        {/* Placeholder contextual: muda quando está carregando. */}
        <option value="">{carregando ? 'Carregando...' : '2. Selecione a Categoria'}</option>

        {/* Lista de famílias vindas do pai. Keys estáveis por `id`. */}
        {listaFamilias.map(familia => (
          <option key={familia.id} value={familia.id}>
            {familia.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Familia;
