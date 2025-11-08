// src/Componentes/Ordenar.jsx
// ============================================================================
// Componente: Ordenar
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir e gerenciar as opções de ordenação da busca (UI).
// - Emite para o pai apenas a "chave" de ordenação escolhida,
//   sem falar com a API diretamente.
//
// Diretrizes (alinhadas ao back):
// - Este componente expõe valores canônicos esperados pela camada de integração:
//     • 'relevancia'
//     • 'menor-preco'
//     • 'maior-preco'
//     • 'melhor-avaliacao'
// - O mapeamento para os parâmetros do backend é responsabilidade do pai,
//   que deve convertê-los para { ordenar_por, ordem } (e, se necessário,
//   também { sort, order }, conforme utilitário withOrdering do api.js).
//   Ex.: 'menor-preco' => { ordenar_por: 'preco', ordem: 'asc' }.
// - Não há acoplamento ao axios nem à URL da API neste componente.
//
// UX / Comportamento:
// - Mantém estado local para refletir visualmente a seleção.
// - Sincroniza quando a prop externa 'ordenacaoAtual' mudar.
// - Em dispositivos móveis (<= 767px), fecha o modal após a seleção.
// - A acessibilidade é respeitada via inputs type="radio" com 'label for'.
//
// Contratos esperados pelo pai:
// - prop `ordenacaoAtual`: string, uma das opções válidas.
// - prop `onMudarOrdenacao(novaOrdenacao: string)`: notifica mudança.
// - prop `onClose()`: fecha o modal (usado no mobile/off-canvas).
// - prop `visivel`: classe CSS para controle de visibilidade.
//
// Testes sugeridos:
// - Trocar entre todas as opções e verificar a emissão para o pai.
// - Alterar 'ordenacaoAtual' externamente e observar sincronização.
// - Em mobile, ao selecionar, o modal deve fechar via onClose().
// ============================================================================

import React, { useState, useEffect } from 'react';
import '/public/style/ordenar.scss';

// Opções de ordenação (valores canônicos consumidos pelo mapeamento no pai)
const opcoesOrdenacao = [
    { value: 'relevancia', label: 'Mais Relevantes' },
    { value: 'menor-preco', label: 'Menor Preço' },
    { value: 'maior-preco', label: 'Maior Preço' },
    { value: 'melhor-avaliacao', label: 'Melhor Avaliação' },
];

/**
 * Componente para exibir e gerenciar as opções de ordenação.
 * @param {string} ordenacaoAtual - A opção de ordenação atualmente selecionada (controlada pelo pai).
 * @param {function(string):void} onMudarOrdenacao - Callback para notificar o pai sobre a mudança de ordenação.
 * @param {function():void} onClose - Callback para fechar o modal (utilizado em mobile/off-canvas).
 * @param {string} visivel - Classe CSS para controlar a visibilidade (p.ex. 'visivel').
 */
function Ordenar({ ordenacaoAtual, onMudarOrdenacao, onClose, visivel}) {
    // Estado local espelha a prop para feedback visual imediato.
    // Observação: a fonte da verdade permanece com o pai.
    const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState(ordenacaoAtual || 'relevancia');

    // Mantém sincronismo quando o pai alterar a seleção externamente.
    useEffect(() => {
        setOrdenacaoSelecionada(ordenacaoAtual);
    }, [ordenacaoAtual]);

    // Handler: altera seleção local, notifica o pai e (em mobile) fecha o modal
    // O pai é responsável por converter a seleção para os parâmetros do backend.
    const handleChange = (e) => {
        const novaOrdenacao = e.target.value;
        setOrdenacaoSelecionada(novaOrdenacao);
        onMudarOrdenacao(novaOrdenacao);
        // Heurística simples para mobile: largura <= 767px
        if (window.innerWidth <= 767) {
            onClose();
        }
    };

    return (
        <div className={`ordenar-modal ${visivel}`}>
            <div className="ordenar-header">
                <h3>Ordenar</h3>
                {/* Botão de fechar (útil para mobile/off-canvas) */}
                <button className="fechar-modal-btn" onClick={onClose}>&times;</button>
            </div>
            
            <div className="opcoes-lista">
                {opcoesOrdenacao.map(opcao => (
                    <div className="opcao-item" key={opcao.value}>
                        <input
                            type="radio"
                            id={`ordenar-${opcao.value}`}
                            name="ordenar"
                            value={opcao.value}
                            checked={ordenacaoSelecionada === opcao.value}
                            onChange={handleChange}
                        />
                        <label htmlFor={`ordenar-${opcao.value}`}>{opcao.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Ordenar;
