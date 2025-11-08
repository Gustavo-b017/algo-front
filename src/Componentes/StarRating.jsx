// src/Componentes/StarRating.jsx
// ============================================================================
// Componente: StarRating
// ----------------------------------------------------------------------------
// Objetivo
// - Exibir visualmente uma avaliação em “5 estrelas” a partir de uma pontuação
//   bruta (score) na escala 0–12, típica do catálogo/algoritmo de relevância.
//   O componente converte 0–12 para 0–5 e preenche proporcionalmente as estrelas.
//
// Diretrizes arquiteturais (alinhadas ao back):
// - Responsabilidade única (SRP): componente puramente apresentacional, sem
//   chamadas à API, sem efeitos colaterais e sem estado externo.
// - Contrato de dados claro: recebe `score` (Number, 0–12) e, opcionalmente,
//   `totalReviews` (Number) do container/página. Internamente só formata.
// - Determinismo: renderização baseada apenas em props; sempre idempotente.
// - Acessibilidade: o wrapper recebe `title` com o valor normalizado (0–5) para
//   leitura assistiva e indicação textual do rating.
// - Evolução: se no futuro a escala de origem mudar, basta ajustar MAX_SCORE.
//   A UI permanece estável (5 estrelas).
//
// Funcionamento
// 1) Normalização: normaliza `score` de 0–12 para 0–5 (clamp em 12).
// 2) Preenchimento: aplica “duas camadas” de SVG de estrelas (vazias e cheias).
//    A largura da camada preenchida é controlada via CSS inline (`width: %`),
//    permitindo valores fracionários (ex.: 4,5 de 5) sem cálculo de meia-estrela.
// 3) Contador: quando `totalReviews` for número, exibe-o ao lado das estrelas.
//
// Observações
// - Sem dependências externas: SVGs inline garantem footprint reduzido.
// - Sem mutação de DOM manual: todo o preenchimento é reativo por CSS.
// - Estilos em `public/style/starRating.scss`.
// ============================================================================

import React from 'react';
import '../../public/style/starRating.scss';

/**
 * Renderiza um display de 5 estrelas com base em uma pontuação (de 0 a 12).
 * @param {object} props
 * @param {number} props.score - Pontuação bruta na escala 0–12 (será clampada).
 * @param {number} [props.totalReviews] - Número de avaliações (opcional).
 */
function StarRating({ score, totalReviews }) {
    // Constantes de escala (facilitam manutenção/ajustes futuros).
    const MAX_STARS = 5;   // Alvo visual (UI sempre em 5 estrelas)
    const MAX_SCORE = 12;  // Escala de entrada (origem: catálogos/cálculos)

    // 1) Normaliza o score de 0–12 para 0–5.
    // - Math.min evita passar de 12; valores >12 são tratados como 12.
    // - Multiplica pela razão 5/12 para converter para a escala de 5 estrelas.
    const normalizedScore = (Math.min(score, MAX_SCORE) / MAX_SCORE) * MAX_STARS;

    // 2) Transforma a nota 0–5 em porcentagem para preencher via CSS.
    // - Ex.: 4.5 -> 90%
    const scorePercent = (normalizedScore / MAX_STARS) * 100;

    return (
        <div className="star-rating-container">
            <div
                className="stars-wrapper"
                // Atributo informativo para leitura assistiva e tooltip.
                title={`Avaliação: ${normalizedScore.toFixed(1)} de 5`}
            >
                {/* Camada base: 5 estrelas “vazias” (fundo) */}
                <div className="stars-empty">
                    {[...Array(MAX_STARS)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="star-icon">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                        </svg>
                    ))}
                </div>

                {/* Camada superior: 5 estrelas “preenchidas” com largura variável */}
                <div className="stars-filled" style={{ width: `${scorePercent}%` }}>
                    {[...Array(MAX_STARS)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="star-icon">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                        </svg>
                    ))}
                </div>
            </div>

            {/* Exibe a contagem de avaliações quando informada */}
            {typeof totalReviews === 'number' && (
                <span className="review-count">({totalReviews})</span>
            )}
        </div>
    );
}

export default StarRating;
