// src/Componentes/Ordenar.jsx
import React, { useState, useEffect } from 'react';
import '/public/style/ordenar.scss';

// Opções de ordenação
const opcoesOrdenacao = [
    { value: 'relevancia', label: 'Mais Relevantes' },
    { value: 'menor-preco', label: 'Menor Preço' },
    { value: 'maior-preco', label: 'Maior Preço' },
    { value: 'melhor-avaliacao', label: 'Melhor Avaliação' },
];

/**
 * Componente para exibir e gerenciar as opções de ordenação.
 * @param {string} ordenacaoAtual - A opção de ordenação atualmente selecionada.
 * @param {function} onMudarOrdenacao - Função para ser chamada quando a ordenação for alterada.
 * @param {function} onClose - Função para fechar o modal (em mobile).
 * @param {string} visivel - Classe para controlar a visibilidade.
 */
function Ordenar({ ordenacaoAtual, onMudarOrdenacao, onClose, visivel}) {
    // Estado para controlar a opção selecionada localmente
    const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState(ordenacaoAtual || 'relevancia');

    // Sincroniza o estado local com a prop externa
    useEffect(() => {
        setOrdenacaoSelecionada(ordenacaoAtual);
    }, [ordenacaoAtual]);

    const handleChange = (e) => {
        const novaOrdenacao = e.target.value;
        setOrdenacaoSelecionada(novaOrdenacao);
        onMudarOrdenacao(novaOrdenacao);
        // Fecha o modal após a seleção, se estiver em mobile
        if (window.innerWidth <= 767) {
            onClose();
        }
    };

    return (
        <div className={`ordenar-modal ${visivel}`}>
            <div className="ordenar-header">
                <h3>Ordenar</h3>
                {/* Botão de fechar visível apenas em mobile */}
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